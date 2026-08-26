package com.ifpr.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.ifpr.backend.model.enums.TipoTransacao;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Data;

@Data
public class TransacaoRequestDTO {

    @NotNull(message = "Tipo é obrigatório")
    private TipoTransacao tipo;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal valor;

    private String descricao;

    @NotNull(message = "Data é obrigatória")
    @PastOrPresent(message = "Data não pode ser futura")
    private LocalDate data;

    private Long categoriaId;
}