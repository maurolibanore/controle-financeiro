package com.ifpr.backend.service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class EventoCarteiraService {

    private final Map<Long, List<SseEmitter>> emissoresPorCarteira = new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());  

    public SseEmitter adicionarConexao(Long carteiraId) {
        SseEmitter emitter = new SseEmitter(3600000L);

        emissoresPorCarteira
                .computeIfAbsent(carteiraId, k -> new CopyOnWriteArrayList<>())
                .add(emitter);

        emitter.onCompletion(() -> removerConexao(carteiraId, emitter));
        emitter.onTimeout(() -> removerConexao(carteiraId, emitter));
        emitter.onError(e -> removerConexao(carteiraId, emitter));

        try {
            emitter.send(SseEmitter.event().name("conectado").data("Conexão estabelecida"));
        } catch (Exception e) {
            removerConexao(carteiraId, emitter);
        }

        return emitter;
    }

    public void notificarCarteira(Long carteiraId, String tipoEvento, Object dados) {
        List<SseEmitter> emissores = emissoresPorCarteira.get(carteiraId);
        if (emissores == null || emissores.isEmpty()) return;

        for (SseEmitter emitter : emissores) {
            try {
                String json = objectMapper.writeValueAsString(dados);
                emitter.send(SseEmitter.event().name(tipoEvento).data(json));
            } catch (Exception e) {
                removerConexao(carteiraId, emitter);
            }
        }
    }

    private void removerConexao(Long carteiraId, SseEmitter emitter) {
        List<SseEmitter> emissores = emissoresPorCarteira.get(carteiraId);
        if (emissores != null) {
            emissores.remove(emitter);
        }
    }
}