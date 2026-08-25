package com.ifpr.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifpr.backend.model.Categoria;
import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.model.enums.TipoTransacao;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    List<Categoria> findByUsuario(Usuario usuario);

    List<Categoria> findByUsuarioAndTipo(Usuario usuario, TipoTransacao tipo);

    Optional<Categoria> findByIdAndUsuario(Long id, Usuario usuario);
}