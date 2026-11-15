package com.ifpr.backend.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.ifpr.backend.exception.NegocioExcecao;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-2.0-flash}")
    private String model;

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    @SuppressWarnings("unchecked")
    public String gerarTexto(String prompt) {
        if (!isConfigured()) {
            throw new NegocioExcecao("GEMINI_API_KEY não configurada");
        }

        String url = String.format(GEMINI_URL, model, apiKey);

        Map<String, Object> body = Map.of(
            "contents", List.of(Map.of(
                "parts", List.of(Map.of("text", prompt))
            ))
        );

        log.info("Chamando Gemini ({}) para gerar análise", model);

        try {
            Map<String, Object> resposta = WebClient.builder()
                .baseUrl(url)
                .defaultHeader("content-type", MediaType.APPLICATION_JSON_VALUE)
                .build()
                .post()
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) resposta.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String texto = (String) parts.get(0).get("text");

            log.info("Resposta Gemini recebida com sucesso ({} caracteres)", texto.length());
            return texto;

        } catch (Exception e) {
            log.error("Erro ao chamar Gemini: {}", e.getMessage(), e);
            throw new NegocioExcecao("Não foi possível gerar a análise. Tente novamente.");
        }
    }
}