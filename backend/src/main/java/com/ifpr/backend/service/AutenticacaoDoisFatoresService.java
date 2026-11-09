package com.ifpr.backend.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ifpr.backend.exception.NegocioExcecao;
import com.ifpr.backend.model.CodigoAutenticacao;
import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.repository.CodigoAutenticacaoRepository;

@Service
public class AutenticacaoDoisFatoresService {

    @Autowired
    private CodigoAutenticacaoRepository repository;

    @Autowired
    private EnvioEmailService envioEmailService;

    private final SecureRandom random = new SecureRandom();

    @Transactional
    public void gerarEEnviarCodigo(Usuario usuario) {
        repository.deleteByUsuario(usuario);

        String codigo = String.format("%06d", random.nextInt(1000000));

        CodigoAutenticacao registro = new CodigoAutenticacao();
        registro.setUsuario(usuario);
        registro.setCodigo(codigo);
        registro.setCriadoEm(LocalDateTime.now());
        registro.setExpiraEm(LocalDateTime.now().plusMinutes(5));
        registro.setUsado(false);
        repository.save(registro);

        envioEmailService.enviarCodigoAutenticacao(usuario.getEmail(), usuario.getNome(), codigo);
    }

    public void validarCodigo(Usuario usuario, String codigo) {
        CodigoAutenticacao registro = repository
                .findByUsuarioAndCodigoAndUsadoFalse(usuario, codigo)
                .orElseThrow(() -> new NegocioExcecao("Código inválido."));

        if (registro.getExpiraEm().isBefore(LocalDateTime.now())) {
            throw new NegocioExcecao("Código expirado. Faça login novamente.");
        }

        registro.setUsado(true);
        repository.save(registro);
    }
}