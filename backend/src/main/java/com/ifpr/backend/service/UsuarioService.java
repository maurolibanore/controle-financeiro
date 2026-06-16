package com.ifpr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    public Usuario inserir(Usuario usuario) {
        return repository.save(usuario);
    }

    public Usuario atualizar(Usuario usuario) {
        
        Usuario usuarioEncontrado = buscarPorId(usuario.getId());
        usuarioEncontrado.setNome(usuario.getNome());
        usuarioEncontrado.setEmail(usuario.getEmail());
        
        // Mantive a lógica original do seu amigo: a senha não é atualizada na rota de Patch.

        return repository.save(usuarioEncontrado);
    }

    public void deletarPorId(Long id) {
        repository.deleteById(id);
    }

    public List<Usuario> buscarTodos() {
        return repository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return usuario;
    }
}