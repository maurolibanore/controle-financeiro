package com.ifpr.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.dto.CarteiraRequestDTO;
import com.ifpr.backend.dto.CarteiraResponseDTO;
import com.ifpr.backend.service.CarteiraService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/carteira")
@CrossOrigin
public class CarteiraController {

    @Autowired
    private CarteiraService service;

    @PostMapping
    public ResponseEntity<CarteiraResponseDTO> inserir(@Valid @RequestBody CarteiraRequestDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.inserir(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarteiraResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody CarteiraRequestDTO dto){
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CarteiraResponseDTO> deletar(@PathVariable Long id){
        service.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping
    public ResponseEntity<List<CarteiraResponseDTO>> buscarTodas() {
        return ResponseEntity.ok(service.buscarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarteiraResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }
}
