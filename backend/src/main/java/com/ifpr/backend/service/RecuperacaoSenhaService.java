package com.ifpr.backend.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import com.ifpr.backend.dto.EsqueciSenhaDTO;
import com.ifpr.backend.dto.RedefinirSenhaDTO;
import com.ifpr.backend.exception.NegocioExcecao;
import com.ifpr.backend.model.TokenRedefinicaoSenha;
import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.repository.TokenRedefinicaoSenhaRepository;
import com.ifpr.backend.repository.UsuarioRepository;


@Service
public class RecuperacaoSenhaService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenRedefinicaoSenhaRepository tokenRepository;

    @Autowired
    private EnvioEmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void solicitarRecuperacao(EsqueciSenhaDTO dto){
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(dto.getEmail());

        // nao mostra se o email existe
        if(usuarioOpt.isEmpty()){
            return;
        }

        Usuario usuario = usuarioOpt.get();

        // gerar o token
        String token = UUID.randomUUID().toString();

        TokenRedefinicaoSenha tokenRedefinicao = new TokenRedefinicaoSenha();
        tokenRedefinicao.setUsuario(usuario);
        tokenRedefinicao.setToken(token);
        tokenRedefinicao.setExpiraEm(LocalDateTime.now().plusHours(1));
        tokenRedefinicao.setUtilizado(false);
        tokenRepository.save(tokenRedefinicao);

        Context context = new Context();
        context.setVariable("nome", usuario.getNome());
        context.setVariable("link", "http://localhost:5173/redefinir-senha/" + token);

        emailService.enviaEmailTemplate(usuario.getEmail(), "Recuperação de Senha", "recuperacaoSenha", context);

    }

    public void redefinirSenha(RedefinirSenhaDTO dto){
        TokenRedefinicaoSenha tokenRedefinicao = tokenRepository.findByToken(dto.getToken()).orElseThrow(()-> new NegocioExcecao("Token inválido"));

        if(tokenRedefinicao.isUtilizado()){
            throw new NegocioExcecao("Esse token já foi utilizado");
        }
        if(tokenRedefinicao.getExpiraEm().isBefore(LocalDateTime.now())){
            throw new NegocioExcecao("Token expirado");
        }

        Usuario usuario = tokenRedefinicao.getUsuario();
        usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()));
        usuarioRepository.save(usuario);

        tokenRedefinicao.setUtilizado(true);
        tokenRepository.save(tokenRedefinicao);
    }
}
