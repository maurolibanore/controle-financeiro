package com.ifpr.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.dto.CategoriaRequestDTO;
import com.ifpr.backend.dto.CategoriaResponseDTO;
import com.ifpr.backend.exception.NaoEncontradoExcecao;
import com.ifpr.backend.model.Categoria;
import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.model.enums.TipoTransacao;
import com.ifpr.backend.repository.CategoriaRepository;
import com.ifpr.backend.security.AuthUsuarioProvider;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository repository;

    @Autowired
    private AuthUsuarioProvider authUsuarioProvider;

    public CategoriaResponseDTO inserir(CategoriaRequestDTO dto) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();

        Categoria categoria = new Categoria();
        categoria.setNome(dto.getNome());
        categoria.setTipo(dto.getTipo());
        categoria.setCor(dto.getCor());
        categoria.setIcone(dto.getIcone());
        categoria.setUsuario(usuarioLogado);

        Categoria salva = repository.save(categoria);
        return converterParaDTO(salva);
    }

    public CategoriaResponseDTO atualizar(Long id, CategoriaRequestDTO dto) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();

        Categoria categoria = repository.findByIdAndUsuario(id, usuarioLogado)
                .orElseThrow(() -> new NaoEncontradoExcecao("Categoria não encontrada"));

        categoria.setNome(dto.getNome());
        categoria.setTipo(dto.getTipo());
        categoria.setCor(dto.getCor());
        categoria.setIcone(dto.getIcone());

        Categoria atualizada = repository.save(categoria);
        return converterParaDTO(atualizada);
    }

    public void deletarPorId(Long id) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();

        Categoria categoria = repository.findByIdAndUsuario(id, usuarioLogado)
                .orElseThrow(() -> new NaoEncontradoExcecao("Categoria não encontrada"));

        repository.delete(categoria);
    }

    public List<CategoriaResponseDTO> buscarTodas(TipoTransacao tipo) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();

        List<Categoria> categorias;
        if (tipo != null) {
            categorias = repository.findByUsuarioAndTipo(usuarioLogado, tipo);
        } else {
            categorias = repository.findByUsuario(usuarioLogado);
        }

        return categorias.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public CategoriaResponseDTO buscarPorId(Long id) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();

        Categoria categoria = repository.findByIdAndUsuario(id, usuarioLogado)
                .orElseThrow(() -> new NaoEncontradoExcecao("Categoria não encontrada"));

        return converterParaDTO(categoria);
    }

    private CategoriaResponseDTO converterParaDTO(Categoria categoria) {
        return new CategoriaResponseDTO(
                categoria.getId(),
                categoria.getNome(),
                categoria.getTipo(),
                categoria.getCor(),
                categoria.getIcone()
        );
    }
}