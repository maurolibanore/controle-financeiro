package com.ifpr.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EnvioEmailService {

    private static final Logger log = LoggerFactory.getLogger(EnvioEmailService.class);    
    
    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private TemplateEngine templateEngine;
    
    @Autowired 
    private BrevoEmailService brevoEmailService;

    public void enviarEmail(String destinatario, String assunto, String texto){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinatario);
        message.setSubject(assunto);
        message.setText(texto);
        javaMailSender.send(message);
    }

    @Async
    public void enviaEmailTemplate(String destinatario, String assunto, String template, Context contexto){
        log.info("Iniciando envio de email para: {}", destinatario);
        try {
            String templateString = templateEngine.process(template, contexto);
            log.info("Template '{}' processado com sucesso", template);
            
            if (brevoEmailService.isConfigured()) {
                brevoEmailService.enviar(destinatario, assunto, templateString);
                return;
            }
            
            //fallback: SMTP Gmail 
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(destinatario);
            helper.setSubject(assunto);
            helper.setText(templateString, true);
            
            log.info("Mensagem construída, chamando send() via SMTP...");
            javaMailSender.send(message);
            log.info("Email enviado com sucesso via SMTP para: {}", destinatario);
        } catch (Exception e) {
            log.error("ERRO ao enviar email para {}: {}", destinatario, e.getMessage(), e);
        }
    }

    public void enviarCodigoAutenticacao(String destinatario, String nome, String codigo) {
        try {
            Context context = new Context();
            context.setVariable("nome", nome);
            context.setVariable("codigo", codigo);
            String html = templateEngine.process("codigoAutenticacao", context);
            String assunto = "Seu código de verificação - Prospera";
            
            //se Brevo estiver configurado, usa a API HTTP
            if (brevoEmailService.isConfigured()) {
                brevoEmailService.enviar(destinatario, assunto, html);
                return;
            }
            
            // Fallback: SMTP Gmail para local
            MimeMessage mensagem = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");
            helper.setTo(destinatario);
            helper.setSubject(assunto);
            helper.setText(html, true);
            javaMailSender.send(mensagem);
        } catch (MessagingException e) {
            throw new RuntimeException("Erro ao enviar email de código 2FA", e);
        }
    }

}
