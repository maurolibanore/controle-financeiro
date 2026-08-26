package com.ifpr.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.dto.AlterarPapelDTO;
import com.ifpr.backend.dto.MembroRequestDTO;
import com.ifpr.backend.dto.MembroResponseDTO;
import com.ifpr.backend.exception.NaoEncontradoExcecao;
import com.ifpr.backend.exception.NegocioExcecao;
import com.ifpr.backend.model.Carteira;
import com.ifpr.backend.model.CarteiraMembro;
import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.model.enums.PapelCarteira;
import com.ifpr.backend.repository.CarteiraMembroRepository;
import com.ifpr.backend.repository.CarteiraRepository;
import com.ifpr.backend.repository.UsuarioRepository;
import com.ifpr.backend.security.AuthUsuarioProvider;

@Service
public class CarteiraMembroService {

    @Autowired
    private CarteiraMembroRepository repository;

    @Autowired
    private CarteiraRepository carteiraRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuthUsuarioProvider authUsuarioProvider;

    public List<MembroResponseDTO> listarMembros(Long carteiraId) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();
        Carteira carteira = buscarCarteiraSeMembro(carteiraId, usuarioLogado);

        return repository.findByCarteira(carteira).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public MembroResponseDTO adicionarMembro(Long carteiraId, MembroRequestDTO dto) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();
        Carteira carteira = buscarCarteiraSeDono(carteiraId, usuarioLogado);

        Usuario novoMembro = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new NaoEncontradoExcecao("Usuário com este e-mail não encontrado"));

        if (repository.existsByCarteiraAndUsuario(carteira, novoMembro)) {
            throw new NegocioExcecao("Este usuário já é membro da carteira");
        }

        if (dto.getPapel() == PapelCarteira.DONO) {
            throw new NegocioExcecao("Não é possível adicionar outro dono à carteira");
        }

        CarteiraMembro membro = new CarteiraMembro();
        membro.setCarteira(carteira);
        membro.setUsuario(novoMembro);
        membro.setPapel(dto.getPapel());
        CarteiraMembro salvo = repository.save(membro);

        return converterParaDTO(salvo);
    }

    public MembroResponseDTO alterarPapel(Long carteiraId, Long usuarioId, AlterarPapelDTO dto) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();
        Carteira carteira = buscarCarteiraSeDono(carteiraId, usuarioLogado);

        Usuario usuarioMembro = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new NaoEncontradoExcecao("Usuário não encontrado"));

        CarteiraMembro membro = repository.findByCarteiraAndUsuario(carteira, usuarioMembro)
                .orElseThrow(() -> new NaoEncontradoExcecao("Este usuário não é membro da carteira"));

        if (membro.getPapel() == PapelCarteira.DONO) {
            throw new NegocioExcecao("Não é possível alterar o papel do dono");
        }

        if (dto.getPapel() == PapelCarteira.DONO) {
            throw new NegocioExcecao("Não é possível promover a dono");
        }

        membro.setPapel(dto.getPapel());
        return converterParaDTO(repository.save(membro));
    }

    public void removerMembro(Long carteiraId, Long usuarioId) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();
        Carteira carteira = buscarCarteiraSeDono(carteiraId, usuarioLogado);

        Usuario usuarioMembro = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new NaoEncontradoExcecao("Usuário não encontrado"));

        CarteiraMembro membro = repository.findByCarteiraAndUsuario(carteira, usuarioMembro)
                .orElseThrow(() -> new NaoEncontradoExcecao("Este usuário não é membro da carteira"));

        if (membro.getPapel() == PapelCarteira.DONO) {
            throw new NegocioExcecao("Não é possível remover o dono da carteira");
        }

        repository.delete(membro);
    }

    private Carteira buscarCarteiraSeDono(Long carteiraId, Usuario usuario) {
        Carteira carteira = carteiraRepository.findById(carteiraId)
                .orElseThrow(() -> new NaoEncontradoExcecao("Carteira não encontrada"));

        if (!carteira.getDono().getId().equals(usuario.getId())) {
            throw new NegocioExcecao("Apenas o dono pode gerenciar membros");
        }

        return carteira;
    }

    private Carteira buscarCarteiraSeMembro(Long carteiraId, Usuario usuario) {
        Carteira carteira = carteiraRepository.findById(carteiraId)
                .orElseThrow(() -> new NaoEncontradoExcecao("Carteira não encontrada"));

        if (!repository.existsByCarteiraAndUsuario(carteira, usuario)) {
            throw new NegocioExcecao("Você não é membro desta carteira");
        }

        return carteira;
    }

    private MembroResponseDTO converterParaDTO(CarteiraMembro membro) {
        return new MembroResponseDTO(
                membro.getId(),
                membro.getUsuario().getId(),
                membro.getUsuario().getNome(),
                membro.getUsuario().getEmail(),
                membro.getPapel(),
                membro.getEntradoEm()
        );
    }
}