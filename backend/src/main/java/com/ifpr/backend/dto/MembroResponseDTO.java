package com.ifpr.backend.dto;

import java.time.LocalDateTime;

import com.ifpr.backend.model.enums.PapelCarteira;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MembroResponseDTO {
    private Long id;
    private Long usuarioId;
    private String usuarioNome;
    private String usuarioEmail;
    private PapelCarteira papel;
    private LocalDateTime entradoEm;
}