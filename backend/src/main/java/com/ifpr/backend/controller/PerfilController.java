package com.ifpr.backend.controller;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid; // Importação necessária para a sua validação funcionar

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.model.Perfil;
import com.ifpr.backend.service.PerfilService;

@RestController
@RequestMapping("/perfil")
public class PerfilController {
    
    @Autowired
    private PerfilService service;

    @PostMapping
    public ResponseEntity<Perfil> inserir(@Valid @RequestBody Perfil perfil) {
        // O @Valid garante que a validação de "descrição obrigatória" seja executada
        return ResponseEntity.status(HttpStatus.CREATED).body(service.inserir(perfil));
    }

    @PatchMapping
    public ResponseEntity<Perfil> atualizar(@RequestBody Perfil perfil) {
        return ResponseEntity.status(HttpStatus.OK).body(service.atualizar(perfil));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        service.deletarPorId(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping
    public ResponseEntity<List<Perfil>> buscarTodos() {
        return ResponseEntity.status(HttpStatus.OK).body(service.buscarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Perfil> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.status(HttpStatus.OK).body(service.buscarPorId(id));
    }
}