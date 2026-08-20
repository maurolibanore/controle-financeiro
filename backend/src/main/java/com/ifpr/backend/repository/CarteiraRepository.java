package com.ifpr.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifpr.backend.model.Carteira;

public interface CarteiraRepository extends JpaRepository<Carteira, Long> {
}