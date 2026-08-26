package com.ifpr.backend.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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

    // se nao tiver transacao retorna zero e nao null
    @Query("SELECT COALESCE(SUM(t.valor), 0) FROM Transacao t " +
           "WHERE t.carteira = :carteira AND t.tipo = :tipo " +
           "AND (:dataInicio IS NULL OR t.data >= :dataInicio) " +
           "AND (:dataFim IS NULL OR t.data <= :dataFim)")
    BigDecimal somarPorTipo(
            @Param("carteira") Carteira carteira,
            @Param("tipo") TipoTransacao tipo,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim);

    @Query("SELECT t.categoria.nome, t.categoria.cor, t.tipo, SUM(t.valor) FROM Transacao t " +
           "WHERE t.carteira = :carteira AND t.categoria IS NOT NULL " +
           "AND (:dataInicio IS NULL OR t.data >= :dataInicio) " +
           "AND (:dataFim IS NULL OR t.data <= :dataFim) " +
           "GROUP BY t.categoria.id, t.categoria.nome, t.categoria.cor, t.tipo")
    List<Object[]> somarPorCategoria( // retorna uma lista com nome, cor, tipo e total agrupado por cat
            @Param("carteira") Carteira carteira,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim);
}