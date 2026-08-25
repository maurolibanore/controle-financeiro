package com.ifpr.backend.dto;

import com.ifpr.backend.model.enums.TipoTransacao;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoriaRequestDTO {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 80, message = "Nome deve ter no máximo 80 caracteres")
    private String nome;

    @NotNull(message = "Tipo é obrigatório")
    private TipoTransacao tipo;

    private String cor;

    private String icone;
}