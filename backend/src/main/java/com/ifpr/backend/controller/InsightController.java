package com.ifpr.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.dto.InsightResponseDTO;
import com.ifpr.backend.service.InsightService;

@RestController
@RequestMapping("/carteira/{carteiraId}/insights")
@CrossOrigin
public class InsightController {

    @Autowired
    private InsightService service;

    @GetMapping
    public ResponseEntity<InsightResponseDTO> gerarInsights(
            @PathVariable Long carteiraId,
            @RequestParam int mes,
            @RequestParam int ano) {
        return ResponseEntity.ok(service.gerarInsights(carteiraId, mes, ano));
    }
}