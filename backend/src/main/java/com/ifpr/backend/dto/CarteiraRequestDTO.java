package com.ifpr.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CarteiraRequestDTO {
    

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Maximo de 100 caracteres")
    private String nome;

    private String descricao;
}
