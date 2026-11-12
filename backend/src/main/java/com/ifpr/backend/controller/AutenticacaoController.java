package com.ifpr.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.dto.EsqueciSenhaDTO;
import com.ifpr.backend.dto.LoginParcialResponseDTO;
import com.ifpr.backend.dto.LoginRequestDTO;
import com.ifpr.backend.dto.LoginResponseDTO;
import com.ifpr.backend.dto.RedefinirSenhaDTO;
import com.ifpr.backend.dto.VerificarCodigoRequestDTO;
import com.ifpr.backend.exception.NegocioExcecao;
import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.repository.UsuarioRepository;
import com.ifpr.backend.security.JwtService;
import com.ifpr.backend.service.AutenticacaoDoisFatoresService;
import com.ifpr.backend.service.RecuperacaoSenhaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/autenticacao")
@CrossOrigin
public class AutenticacaoController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AutenticacaoDoisFatoresService doisFatoresService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Value("${jwt.expiration}")
    private Long expiration;

    @PostMapping("/login")
    public ResponseEntity<LoginParcialResponseDTO> login(@Valid @RequestBody LoginRequestDTO login) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(login.getEmail(), login.getSenha())
            );
        } catch (BadCredentialsException ex) {
            throw new NegocioExcecao("E-mail ou senha inválidos");
        }

        Usuario usuario = usuarioRepository.findByEmail(login.getEmail())
            .orElseThrow(() -> new NegocioExcecao("Usuário não encontrado"));

        doisFatoresService.gerarEEnviarCodigo(usuario);

        LoginParcialResponseDTO response = new LoginParcialResponseDTO(
            login.getEmail(),
            "Código de verificação enviado ao seu e-mail",
            true
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verificar-codigo")
    public ResponseEntity<LoginResponseDTO> verificarCodigo(@Valid @RequestBody VerificarCodigoRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
            .orElseThrow(() -> new NegocioExcecao("Usuário não encontrado"));

        doisFatoresService.validarCodigo(usuario, dto.getCodigo());

        String token = jwtService.generateToken(usuario.getEmail());
        LoginResponseDTO response = new LoginResponseDTO(token, "Bearer", expiration);

        return ResponseEntity.ok(response);
    }

    @Autowired
    private RecuperacaoSenhaService recuperacaoService;

    @PostMapping("/esqueci-senha")
    public ResponseEntity<Void> esqueciSenha(@Valid @RequestBody EsqueciSenhaDTO dto){
        recuperacaoService.solicitarRecuperacao(dto);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<Void> redefinirSenha(@Valid @RequestBody RedefinirSenhaDTO dto){
        recuperacaoService.redefinirSenha(dto);
        return ResponseEntity.noContent().build();
    }
}