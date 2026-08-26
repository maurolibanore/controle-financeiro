package com.ifpr.backend.dto;

import com.ifpr.backend.model.enums.PapelCarteira;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MembroRequestDTO {

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    private String email;

    @NotNull(message = "Papel é obrigatório")
    private PapelCarteira papel;
}