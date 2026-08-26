package com.ifpr.backend.controller;

import java.util.List;

import jakarta.validation.Valid; // Importação vital para a validação funcionar

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.dto.AlterarSenhaDTO;
import com.ifpr.backend.dto.AtualizarPerfilDTO;
import com.ifpr.backend.dto.UsuarioResponseDTO;
import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.service.UsuarioService;

@RestController
@RequestMapping("/usuario")
@CrossOrigin
public class UsuarioController {
    
    @Autowired
    private UsuarioService service;

    @PostMapping
    public ResponseEntity<Usuario> inserir(@Valid @RequestBody Usuario usuario) {
        // O @Valid garante que as regras do model sejam checadas antes de salvar
        return ResponseEntity.status(HttpStatus.CREATED).body(service.inserir(usuario));
    }

    @PatchMapping
    public ResponseEntity<Usuario> atualizar(@RequestBody Usuario usuario) {
        return ResponseEntity.status(HttpStatus.OK).body(service.atualizar(usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletarPorId(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> buscarTodos() {
        return ResponseEntity.status(HttpStatus.OK).body(service.buscarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(service.buscarPorId(id));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> meuPerfil() {
        return ResponseEntity.ok(service.buscarPerfilLogado());
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> atualizarMeuPerfil(@Valid @RequestBody AtualizarPerfilDTO dto) {
        return ResponseEntity.ok(service.atualizarPerfilLogado(dto));
    }

    @PutMapping("/me/senha")
    public ResponseEntity<Void> alterarMinhaSenha(@Valid @RequestBody AlterarSenhaDTO dto) {
        service.alterarSenha(dto);
        return ResponseEntity.noContent().build();
    }
}