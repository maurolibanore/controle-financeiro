package com.ifpr.backend.exception;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 404 - Nao encontrado
    @ExceptionHandler(NaoEncontradoExcecao.class)
    public ResponseEntity<ErroResposta> tratarNaoEncontrado(NaoEncontradoExcecao ex) {
        ErroResposta erro = new ErroResposta(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }

    // 422 - Erro de negocio
    @ExceptionHandler(NegocioExcecao.class)
    public ResponseEntity<ErroResposta> tratarNegocio(NegocioExcecao ex) {
        ErroResposta erro = new ErroResposta(
                HttpStatus.UNPROCESSABLE_ENTITY.value(),
                ex.getMessage(),
                LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(erro);
    }

    // 403 - Acesso neg
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErroResposta> tratarAcessoNegado(AccessDeniedException ex) {
        ErroResposta erro = new ErroResposta(
                HttpStatus.FORBIDDEN.value(),
                "Você não tem permissão para acessar este recurso",
                LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(erro);
    }

    // 409 - Conflito (por exemplo - email duplicado)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResposta> tratarConflito(DataIntegrityViolationException ex) {
        ErroResposta erro = new ErroResposta(
                HttpStatus.CONFLICT.value(),
                "Já existe um registro com esses dados",
                LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(erro);
    }

    // 400 - Erros de validação
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResposta> tratarValidacao(MethodArgumentNotValidException ex) {
        List<String> mensagens = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(erro -> erro.getField() + ": " + erro.getDefaultMessage())
                .collect(Collectors.toList());

        ErroResposta erro = new ErroResposta(
                HttpStatus.BAD_REQUEST.value(),
                String.join(", ", mensagens),
                LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }

    // 500 - Erro gen (fallback)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResposta> tratarException(Exception ex) {
        ErroResposta erro = new ErroResposta(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Erro interno do servidor",
                LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
    }
}