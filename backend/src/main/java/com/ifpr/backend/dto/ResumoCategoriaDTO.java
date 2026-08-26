package com.ifpr.backend.dto;

import java.math.BigDecimal;

import com.ifpr.backend.model.enums.TipoTransacao;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResumoCategoriaDTO {

    private String categoriaNome;
    private String cor;
    private TipoTransacao tipo;
    private BigDecimal total;
    
}
