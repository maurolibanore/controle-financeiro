package com.ifpr.backend.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, message = "Nome deve ter de 2 a 100 caracteres")
    private String nome;
    
    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank(message = "Senha é obrigatória")
    @Column(nullable = false)
    private String senha;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime criadoEm;

    @CreationTimestamp
    private LocalDateTime atualizadoEm;
}