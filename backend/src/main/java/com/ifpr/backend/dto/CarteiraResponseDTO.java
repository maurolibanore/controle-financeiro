package com.ifpr.backend.dto;

import java.time.LocalDateTime;

import com.ifpr.backend.model.enums.PapelCarteira;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CarteiraResponseDTO {

    private Long id;
    private String nome;
    private String descricao;
    private String donoNome;
    private PapelCarteira meuPapel;
    private LocalDateTime criadoEm;
    
}
