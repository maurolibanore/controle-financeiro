package com.ifpr.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ifpr.backend.dto.ResumoCategoriaDTO;
import com.ifpr.backend.dto.ResumoFinanceiroDTO;
import com.ifpr.backend.dto.TransacaoRequestDTO;
import com.ifpr.backend.dto.TransacaoResponseDTO;
import com.ifpr.backend.exception.NaoEncontradoExcecao;
import com.ifpr.backend.exception.NegocioExcecao;
import com.ifpr.backend.model.Carteira;
import com.ifpr.backend.model.CarteiraMembro;
import com.ifpr.backend.model.Categoria;
import com.ifpr.backend.model.Transacao;
import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.model.enums.PapelCarteira;
import com.ifpr.backend.model.enums.TipoTransacao;
import com.ifpr.backend.repository.CarteiraMembroRepository;
import com.ifpr.backend.repository.CarteiraRepository;
import com.ifpr.backend.repository.CategoriaRepository;
import com.ifpr.backend.repository.TransacaoRepository;
import com.ifpr.backend.security.AuthUsuarioProvider;

@Service
public class TransacaoService {

    @Autowired
    private TransacaoRepository repository;

    @Autowired
    private CarteiraRepository carteiraRepository;

    @Autowired
    private CarteiraMembroRepository membroRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private AuthUsuarioProvider authUsuarioProvider;

    public TransacaoResponseDTO inserir(Long carteiraId, TransacaoRequestDTO dto) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();
        Carteira carteira = buscarCarteiraSeEditor(carteiraId, usuarioLogado);

        Transacao transacao = new Transacao();
        transacao.setCarteira(carteira);
        transacao.setCriadoPor(usuarioLogado);
        transacao.setTipo(dto.getTipo());
        transacao.setValor(dto.getValor());
        transacao.setDescricao(dto.getDescricao());
        transacao.setData(dto.getData());

        if (dto.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findByIdAndUsuario(dto.getCategoriaId(), usuarioLogado)
                    .orElseThrow(() -> new NaoEncontradoExcecao("Categoria não encontrada"));
            transacao.setCategoria(categoria);
        }

        return converterParaDTO(repository.save(transacao));
    }

    public TransacaoResponseDTO atualizar(Long carteiraId, Long id, TransacaoRequestDTO dto) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();
        Carteira carteira = buscarCarteiraSeEditor(carteiraId, usuarioLogado);

        Transacao transacao = repository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Transação não encontrada"));

        if (!transacao.getCarteira().getId().equals(carteira.getId())) {
            throw new NegocioExcecao("Transação não pertence a esta carteira");
        }

        transacao.setTipo(dto.getTipo());
        transacao.setValor(dto.getValor());
        transacao.setDescricao(dto.getDescricao());
        transacao.setData(dto.getData());

        if (dto.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findByIdAndUsuario(dto.getCategoriaId(), usuarioLogado)
                    .orElseThrow(() -> new NaoEncontradoExcecao("Categoria não encontrada"));
            transacao.setCategoria(categoria);
        } else {
            transacao.setCategoria(null);
        }

        return converterParaDTO(repository.save(transacao));
    }

    public void deletarPorId(Long carteiraId, Long id) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();
        Carteira carteira = buscarCarteiraSeEditor(carteiraId, usuarioLogado);

        Transacao transacao = repository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Transação não encontrada"));

        if (!transacao.getCarteira().getId().equals(carteira.getId())) {
            throw new NegocioExcecao("Transação não pertence a esta carteira");
        }

        repository.delete(transacao);
    }

    public Page<TransacaoResponseDTO> buscarTodas(
            Long carteiraId,
            TipoTransacao tipo,
            Long categoriaId,
            LocalDate dataInicio,
            LocalDate dataFim,
            Pageable pageable) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();
        Carteira carteira = buscarCarteiraSeMembro(carteiraId, usuarioLogado);

        return repository.buscarComFiltros(carteira, tipo, categoriaId, dataInicio, dataFim, pageable)
                .map(this::converterParaDTO);
    }

    public TransacaoResponseDTO buscarPorId(Long carteiraId, Long id) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();
        Carteira carteira = buscarCarteiraSeMembro(carteiraId, usuarioLogado);

        Transacao transacao = repository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Transação não encontrada"));

        if (!transacao.getCarteira().getId().equals(carteira.getId())) {
            throw new NegocioExcecao("Transação não pertence a esta carteira");
        }

        return converterParaDTO(transacao);
    }

    private Carteira buscarCarteiraSeMembro(Long carteiraId, Usuario usuario) {
        Carteira carteira = carteiraRepository.findById(carteiraId)
                .orElseThrow(() -> new NaoEncontradoExcecao("Carteira não encontrada"));

        if (!membroRepository.existsByCarteiraAndUsuario(carteira, usuario)) {
            throw new NegocioExcecao("Você não é membro desta carteira");
        }

        return carteira;
    }

    private Carteira buscarCarteiraSeEditor(Long carteiraId, Usuario usuario) {
        Carteira carteira = carteiraRepository.findById(carteiraId)
                .orElseThrow(() -> new NaoEncontradoExcecao("Carteira não encontrada"));

        CarteiraMembro membro = membroRepository.findByCarteiraAndUsuario(carteira, usuario)
                .orElseThrow(() -> new NegocioExcecao("Você não é membro desta carteira"));

        if (membro.getPapel() == PapelCarteira.VISUALIZADOR) {
            throw new NegocioExcecao("Visualizadores não podem criar ou editar transações");
        }

        return carteira;
    }

    private TransacaoResponseDTO converterParaDTO(Transacao t) {
        return new TransacaoResponseDTO(
                t.getId(),
                t.getTipo(),
                t.getValor(),
                t.getDescricao(),
                t.getData(),
                t.getCategoria() != null ? t.getCategoria().getId() : null,
                t.getCategoria() != null ? t.getCategoria().getNome() : null,
                t.getCriadoPor().getNome(),
                t.getCriadoEm()
        );
    }

    public ResumoFinanceiroDTO buscarResumo(Long carteiraId, LocalDate dataInicio, LocalDate dataFim) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();
        Carteira carteira = buscarCarteiraSeMembro(carteiraId, usuarioLogado);

        BigDecimal totalReceitas = repository.somarPorTipo(carteira, TipoTransacao.RECEITA, dataInicio, dataFim);
        BigDecimal totalDespesas = repository.somarPorTipo(carteira, TipoTransacao.DESPESA, dataInicio, dataFim);
        BigDecimal saldo = totalReceitas.subtract(totalDespesas);

        List<ResumoCategoriaDTO> porCategoria = repository.somarPorCategoria(carteira.getId(), dataInicio, dataFim)
                .stream()
                .map(row -> new ResumoCategoriaDTO(
                        (String) row[0],
                        (String) row[1],
                        TipoTransacao.valueOf((String) row[2]),
                        (BigDecimal) row[3]
                ))
                .collect(Collectors.toList());

        return new ResumoFinanceiroDTO(totalReceitas, totalDespesas, saldo, porCategoria);
    }
}