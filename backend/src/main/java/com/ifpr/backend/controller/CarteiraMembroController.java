package com.ifpr.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.dto.AlterarPapelDTO;
import com.ifpr.backend.dto.MembroRequestDTO;
import com.ifpr.backend.dto.MembroResponseDTO;
import com.ifpr.backend.service.CarteiraMembroService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/carteira/{carteiraId}/membros")
@CrossOrigin
public class CarteiraMembroController {

    @Autowired
    private CarteiraMembroService service;

    @GetMapping
    public ResponseEntity<List<MembroResponseDTO>> listar(@PathVariable Long carteiraId) {
        return ResponseEntity.ok(service.listarMembros(carteiraId));
    }

    @PostMapping
    public ResponseEntity<MembroResponseDTO> adicionar(
            @PathVariable Long carteiraId,
            @Valid @RequestBody MembroRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.adicionarMembro(carteiraId, dto));
    }

    @PatchMapping("/{usuarioId}")
    public ResponseEntity<MembroResponseDTO> alterarPapel(
            @PathVariable Long carteiraId,
            @PathVariable Long usuarioId,
            @Valid @RequestBody AlterarPapelDTO dto) {
        return ResponseEntity.ok(service.alterarPapel(carteiraId, usuarioId, dto));
    }

    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<Void> remover(
            @PathVariable Long carteiraId,
            @PathVariable Long usuarioId) {
        service.removerMembro(carteiraId, usuarioId);
        return ResponseEntity.noContent().build();
    }
}