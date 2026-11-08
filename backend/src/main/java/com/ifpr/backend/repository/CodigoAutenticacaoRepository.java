package com.ifpr.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifpr.backend.model.CodigoAutenticacao;
import com.ifpr.backend.model.Usuario;

public interface CodigoAutenticacaoRepository extends JpaRepository<CodigoAutenticacao, Long> {

    Optional<CodigoAutenticacao> findByUsuarioAndCodigoAndUsadoFalse(Usuario usuario, String codigo);

    void deleteByUsuario(Usuario usuario);
}