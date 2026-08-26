package com.ifpr.backend.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.dto.ResumoFinanceiroDTO;
import com.ifpr.backend.dto.TransacaoRequestDTO;
import com.ifpr.backend.dto.TransacaoResponseDTO;
import com.ifpr.backend.model.enums.TipoTransacao;
import com.ifpr.backend.service.TransacaoService;

import jakarta.validation.Valid;
import tools.jackson.databind.cfg.DateTimeFeature;

@RestController
@RequestMapping("/carteira/{carteiraId}/transacao")
@CrossOrigin
public class TransacaoController {

    @Autowired
    private TransacaoService service;

    @PostMapping
    public ResponseEntity<TransacaoResponseDTO> inserir(
            @PathVariable Long carteiraId,
            @Valid @RequestBody TransacaoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.inserir(carteiraId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransacaoResponseDTO> atualizar(
            @PathVariable Long carteiraId,
            @PathVariable Long id,
            @Valid @RequestBody TransacaoRequestDTO dto) {
        return ResponseEntity.ok(service.atualizar(carteiraId, id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long carteiraId,
            @PathVariable Long id) {
        service.deletarPorId(carteiraId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<TransacaoResponseDTO>> buscarTodas(
            @PathVariable Long carteiraId,
            @RequestParam(required = false) TipoTransacao tipo,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            Pageable pageable) {
        return ResponseEntity.ok(service.buscarTodas(carteiraId, tipo, categoriaId, dataInicio, dataFim, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransacaoResponseDTO> buscarPorId(
            @PathVariable Long carteiraId,
            @PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(carteiraId, id));
    }

    @GetMapping("/resumo")
    public ResponseEntity<ResumoFinanceiroDTO> resumo(
            @PathVariable Long carteiraId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        return ResponseEntity.ok(service.buscarResumo(carteiraId, dataInicio, dataFim));
    }
}