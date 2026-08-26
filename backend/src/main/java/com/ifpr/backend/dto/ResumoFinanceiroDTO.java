package com.ifpr.backend.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResumoFinanceiroDTO {

    private BigDecimal totalReceitas;
    private BigDecimal totalDespesas;
    private BigDecimal saldo;
    private List<ResumoCategoriaDTO> porCategoria;
    
}
