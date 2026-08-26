package com.ifpr.backend.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ifpr.backend.model.Carteira;
import com.ifpr.backend.model.Transacao;
import com.ifpr.backend.model.enums.TipoTransacao;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
// ignora os filtros que nao foram passados
    @Query("SELECT t FROM Transacao t WHERE t.carteira = :carteira " +
           "AND (:tipo IS NULL OR t.tipo = :tipo) " +
           "AND (:categoriaId IS NULL OR t.categoria.id = :categoriaId) " +
           "AND (:dataInicio IS NULL OR t.data >= :dataInicio) " +
           "AND (:dataFim IS NULL OR t.data <= :dataFim)")
    Page<Transacao> buscarComFiltros(
            @Param("carteira") Carteira carteira,
            @Param("tipo") TipoTransacao tipo,
            @Param("categoriaId") Long categoriaId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim,
            Pageable pageable);
}