package com.ifpr.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Nome é Obrigatório")
    @Size(min = 3, message = "Insira o nome completo")
    private String name;
    @NotBlank(message = "E-mail é obrigatório")
    private String email;
    @NotBlank(message = "Senha é obrigatório")
    private String password;
}