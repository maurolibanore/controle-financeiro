package com.ifpr.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ifpr.backend.model.enums.TipoTransacao;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TransacaoResponseDTO {
    private Long id;
    private TipoTransacao tipo;
    private BigDecimal valor;
    private String descricao;
    private LocalDate data;
    private Long categoriaId;
    private String categoriaNome;
    private String criadoPorNome;
    private LocalDateTime criadoEm;
}