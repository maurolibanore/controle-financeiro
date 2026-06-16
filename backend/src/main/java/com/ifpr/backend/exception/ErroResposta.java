package com.ifpr.backend.exception;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data // get e set para todos os atributos
@AllArgsConstructor // construtor para todos os atributos
public class ErroResposta {
    private int status;
    private String mensagem;
    private LocalDateTime dataHora;
    
}
