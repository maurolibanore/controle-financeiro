package com.ifpr.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.ifpr.backend.exception.NaoEncontradoExcecao;
import com.ifpr.backend.exception.NegocioExcecao;
import com.ifpr.backend.model.Carteira;
import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.repository.CarteiraMembroRepository;
import com.ifpr.backend.repository.CarteiraRepository;
import com.ifpr.backend.security.AuthUsuarioProvider;
import com.ifpr.backend.service.EventoCarteiraService;

@RestController
@RequestMapping("/eventos")
@CrossOrigin
public class EventoController {

    @Autowired
    private EventoCarteiraService eventoService;

    @Autowired
    private AuthUsuarioProvider authUsuarioProvider;

    @Autowired
    private CarteiraRepository carteiraRepository;

    @Autowired
    private CarteiraMembroRepository membroRepository;

    @GetMapping(value = "/carteira/{carteiraId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter inscrever(@PathVariable Long carteiraId) {
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();

        Carteira carteira = carteiraRepository.findById(carteiraId)
                .orElseThrow(() -> new NaoEncontradoExcecao("Carteira não encontrada"));

        if (!membroRepository.existsByCarteiraAndUsuario(carteira, usuarioLogado)) {
            throw new NegocioExcecao("Você não é membro desta carteira");
        }

        return eventoService.adicionarConexao(carteiraId);
    }
}