package com.ifpr.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.dto.CarteiraRequestDTO;
import com.ifpr.backend.dto.CarteiraResponseDTO;
import com.ifpr.backend.exception.NaoEncontradoExcecao;
import com.ifpr.backend.exception.NegocioExcecao;
import com.ifpr.backend.model.Carteira;
import com.ifpr.backend.model.CarteiraMembro;
import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.model.enums.PapelCarteira;
import com.ifpr.backend.repository.CarteiraMembroRepository;
import com.ifpr.backend.repository.CarteiraRepository;
import com.ifpr.backend.repository.TransacaoRepository;
import com.ifpr.backend.security.AuthUsuarioProvider;

@Service
public class CarteiraService {

    @Autowired
    private CarteiraRepository repository;

    @Autowired
    private CarteiraMembroRepository membroRepository;

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private AuthUsuarioProvider authUsuarioProvider;

    public CarteiraResponseDTO inserir(CarteiraRequestDTO dto){
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();

        Carteira carteira = new Carteira();
        carteira.setNome(dto.getNome());
        carteira.setDescricao(dto.getDescricao());
        carteira.setDono(usuarioLogado);
        Carteira salva = repository.save(carteira);

        CarteiraMembro membro = new CarteiraMembro();
        membro.setCarteira(salva);
        membro.setUsuario(usuarioLogado);
        membro.setPapel(PapelCarteira.DONO);
        membroRepository.save(membro);

        return converterParaDTO(salva, PapelCarteira.DONO);
    }
    
    public CarteiraResponseDTO atualizar(Long id, CarteiraRequestDTO dto){
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();
        Carteira carteira = buscarCarteiraSeDono(id, usuarioLogado);

        carteira.setNome(dto.getNome());
        carteira.setDescricao(dto.getDescricao());
        Carteira atualizada = repository.save(carteira);

        return converterParaDTO(atualizada, PapelCarteira.DONO);
    }

    public void deletarPorId(Long id) {
    Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();
    Carteira carteira = buscarCarteiraSeDono(id, usuarioLogado);
    
    // deleta todas as transacoes da carteira primeiro
    transacaoRepository.deleteAll(transacaoRepository.findAll().stream()
        .filter(t -> t.getCarteira().getId().equals(carteira.getId()))
        .toList());
    
    repository.delete(carteira);
}

    public List<CarteiraResponseDTO> buscarTodas() {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();
        List<Carteira> carteiras = repository.buscarCarteirasDoUsuario(usuarioLogado);

        return carteiras.stream()
                .map(c -> {
                    PapelCarteira papel = membroRepository.findByCarteiraAndUsuario(c, usuarioLogado)
                            .map(CarteiraMembro::getPapel)
                            .orElse(null);
                    return converterParaDTO(c, papel);
                })
                .collect(Collectors.toList());
    }

    public CarteiraResponseDTO buscarPorId(Long id) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();
        Carteira carteira = repository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Carteira não encontrada"));

        CarteiraMembro membro = membroRepository.findByCarteiraAndUsuario(carteira, usuarioLogado)
                .orElseThrow(() -> new NegocioExcecao("Você não é membro desta carteira"));

        return converterParaDTO(carteira, membro.getPapel());
    }

    // busca a carteira e valida se é dono
    private Carteira buscarCarteiraSeDono(Long id, Usuario usuario) {
        Carteira carteira = repository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Carteira não encontrada"));

        if (!carteira.getDono().getId().equals(usuario.getId())) {
            throw new NegocioExcecao("Apenas o dono pode realizar esta operação");
        }

        return carteira;
    }

    private CarteiraResponseDTO converterParaDTO(Carteira carteira, PapelCarteira papel) {
        return new CarteiraResponseDTO(
                carteira.getId(),
                carteira.getNome(),
                carteira.getDescricao(),
                carteira.getDono().getNome(),
                papel,
                carteira.getCriadoEm()
        );
    }
}
