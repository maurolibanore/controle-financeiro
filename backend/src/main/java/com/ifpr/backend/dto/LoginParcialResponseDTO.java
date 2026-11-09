package com.ifpr.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginParcialResponseDTO {

    private String email;
    private String mensagem;
    private boolean requerVerificacao;
}