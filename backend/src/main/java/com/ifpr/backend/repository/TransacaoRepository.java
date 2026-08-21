package com.ifpr.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifpr.backend.model.Transacao;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    
}
