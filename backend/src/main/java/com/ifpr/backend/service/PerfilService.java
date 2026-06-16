package com.ifpr.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.model.Perfil;
import com.ifpr.backend.repository.PerfilRepository;

@Service
public class PerfilService {

    @Autowired
    private PerfilRepository repository;

    public Perfil inserir(Perfil perfil) {
        return repository.save(perfil);
    }

    public Perfil atualizar(Perfil perfil) {
        // Busca o perfil no banco pelo ID
        Perfil perfilEncontrado = buscarPorId(perfil.getId());
        
        // Atualiza apenas a descrição
        perfilEncontrado.setDescricao(perfil.getDescricao());

        return repository.save(perfilEncontrado);
    }

    public void deletarPorId(UUID id) {
        repository.deleteById(id);
    }

    public List<Perfil> buscarTodos() {
        return repository.findAll();
    }

    public Perfil buscarPorId(UUID id) {
        Perfil perfil = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));

        return perfil;
    }
}