package com.ifpr.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ifpr.backend.model.Carteira;
import com.ifpr.backend.model.Usuario;

public interface CarteiraRepository extends JpaRepository<Carteira, Long> {

    @Query("SELECT DISTINCT c FROM Carteira c JOIN c.membros m WHERE m.usuario = :usuario")
    List<Carteira> buscarCarteirasDoUsuario(@Param("usuario") Usuario usuario);
}