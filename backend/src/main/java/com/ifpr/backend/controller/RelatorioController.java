package com.ifpr.backend.controller;

import java.io.IOException;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.model.enums.TipoTransacao;
import com.ifpr.backend.service.RelatorioService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/carteira/{carteiraId}/relatorio")
@CrossOrigin
public class RelatorioController {

    @Autowired
    private RelatorioService service;

    @GetMapping("/transacoes/pdf")
    public void gerarPdf(
            @PathVariable Long carteiraId,
            @RequestParam(required = false) TipoTransacao tipo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            HttpServletResponse response) throws IOException {

        byte[] pdf = service.gerarPdfTransacoes(carteiraId, tipo, dataInicio, dataFim);

        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"relatorio-prospera-" + LocalDate.now() + ".pdf\"");
        response.setContentLength(pdf.length);
        response.getOutputStream().write(pdf);
        response.getOutputStream().flush();
    }
}