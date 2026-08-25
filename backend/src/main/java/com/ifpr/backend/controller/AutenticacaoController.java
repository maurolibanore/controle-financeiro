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

import com.ifpr.backend.dto.LoginRequestDTO;
import com.ifpr.backend.dto.LoginResponseDTO;
import com.ifpr.backend.exception.NegocioExcecao;
import com.ifpr.backend.security.JwtService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/autenticacao")
@CrossOrigin
public class AutenticacaoController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Value("${jwt.expiration}")
    private Long expiration;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO login) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(login.getEmail(), login.getSenha())
            );
        } catch (BadCredentialsException ex) {
            throw new NegocioExcecao("E-mail ou senha inválidos");
        }

        String token = jwtService.generateToken(login.getEmail());
        LoginResponseDTO response = new LoginResponseDTO(token, "Bearer", expiration);

        return ResponseEntity.ok(response);
    }
}