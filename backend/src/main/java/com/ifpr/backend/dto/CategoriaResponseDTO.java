package com.ifpr.backend.dto;

import com.ifpr.backend.model.enums.TipoTransacao;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoriaResponseDTO {
    private Long id;
    private String nome;
    private TipoTransacao tipo;
    private String cor;
    private String icone;
}