package com.ifpr.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifpr.backend.model.Carteira;
import com.ifpr.backend.model.CarteiraMembro;
import com.ifpr.backend.model.Usuario;

public interface CarteiraMembroRepository extends JpaRepository<CarteiraMembro, Long> {

    Optional<CarteiraMembro> findByCarteiraAndUsuario(Carteira carteira, Usuario usuario);

    List<CarteiraMembro> findByCarteira(Carteira carteira);

    boolean existsByCarteiraAndUsuario(Carteira carteira, Usuario usuario);
}