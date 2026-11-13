package com.ifpr.backend.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class BrevoEmailService {

    private static final Logger log = LoggerFactory.getLogger(BrevoEmailService.class);
    private static final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";

    @Value("${brevo.api.key:}")
    private String apiKey;

    @Value("${brevo.api.sender.email}")
    private String senderEmail;

    @Value("${brevo.api.sender.name}")
    private String senderName;

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    public void enviar(String destinatario, String assunto, String htmlContent) {
        if (!isConfigured()) {
            throw new IllegalStateException("BREVO_API_KEY não configurada");
        }

        Map<String, Object> body = Map.of(
            "sender", Map.of(
                "name", senderName,
                "email", senderEmail
            ),
            "to", List.of(Map.of("email", destinatario)),
            "subject", assunto,
            "htmlContent", htmlContent
        );

        log.info("Enviando email via Brevo para: {}", destinatario);

        WebClient.builder()
            .baseUrl(BREVO_URL)
            .defaultHeader("api-key", apiKey)
            .defaultHeader("accept", "application/json")
            .defaultHeader("content-type", MediaType.APPLICATION_JSON_VALUE)
            .build()
            .post()
            .bodyValue(body)
            .retrieve()
            .toBodilessEntity()
            .block();

        log.info("Email enviado via Brevo com sucesso para: {}", destinatario);
    }
}