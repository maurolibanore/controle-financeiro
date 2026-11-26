package com.ifpr.backend.service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.exception.NaoEncontradoExcecao;
import com.ifpr.backend.exception.NegocioExcecao;
import com.ifpr.backend.model.Carteira;
import com.ifpr.backend.model.Transacao;
import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.model.enums.TipoTransacao;
import com.ifpr.backend.repository.CarteiraMembroRepository;
import com.ifpr.backend.repository.CarteiraRepository;
import com.ifpr.backend.repository.TransacaoRepository;
import com.ifpr.backend.security.AuthUsuarioProvider;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

@Service
public class RelatorioService {

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private CarteiraRepository carteiraRepository;

    @Autowired
    private CarteiraMembroRepository membroRepository;

    @Autowired
    private AuthUsuarioProvider authUsuarioProvider;

    private static final DateTimeFormatter FMT_DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_DATA_HORA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DeviceRgb VERDE = new DeviceRgb(22, 163, 74);
    private static final DeviceRgb CINZA_CLARO = new DeviceRgb(243, 244, 246);
    private static final DeviceRgb VERMELHO = new DeviceRgb(220, 38, 38);

    public byte[] gerarPdfTransacoes(Long carteiraId, TipoTransacao tipo,
                                      LocalDate dataInicio, LocalDate dataFim) {

        Usuario usuario = authUsuarioProvider.getUsuarioAutenticado();
        Carteira carteira = carteiraRepository.findById(carteiraId)
                .orElseThrow(() -> new NaoEncontradoExcecao("Carteira não encontrada"));

        if (!membroRepository.existsByCarteiraAndUsuario(carteira, usuario)) {
            throw new NegocioExcecao("Você não é membro desta carteira");
        }

        List<Transacao> transacoes = transacaoRepository.buscarComFiltros(
                carteira, tipo, null, dataInicio, dataFim,
                org.springframework.data.domain.PageRequest.of(0, 1000)
        ).getContent();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (PdfWriter writer = new PdfWriter(baos);
             PdfDocument pdfDoc = new PdfDocument(writer);
             Document doc = new Document(pdfDoc)) {

            doc.setMargins(40, 40, 40, 40);

            Table header = new Table(UnitValue.createPercentArray(new float[]{1}))
                    .useAllAvailableWidth();
            Cell headerCell = new Cell().setBackgroundColor(VERDE).setBorder(Border.NO_BORDER).setPadding(16);
            headerCell.add(new Paragraph("Prospera").setFontSize(24).setBold().setFontColor(ColorConstants.WHITE));
            headerCell.add(new Paragraph("Relatório Financeiro").setFontSize(12).setFontColor(ColorConstants.WHITE));
            header.addCell(headerCell);
            doc.add(header);

            doc.add(new Paragraph("\n"));

            doc.add(new Paragraph("Dados do relatório").setBold().setFontSize(13));
            doc.add(infoLinha("Usuário:", usuario.getNome()));
            doc.add(infoLinha("Carteira:", carteira.getNome()));
            doc.add(infoLinha("Período:", formatarPeriodo(dataInicio, dataFim)));
            if (tipo != null) {
                doc.add(infoLinha("Tipo:", tipo.name()));
            }
            doc.add(infoLinha("Gerado em:", LocalDateTime.now().format(FMT_DATA_HORA)));

            doc.add(new Paragraph("\n"));

            BigDecimal totalReceitas = transacoes.stream()
                    .filter(t -> t.getTipo() == TipoTransacao.RECEITA)
                    .map(Transacao::getValor)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal totalDespesas = transacoes.stream()
                    .filter(t -> t.getTipo() == TipoTransacao.DESPESA)
                    .map(Transacao::getValor)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal saldo = totalReceitas.subtract(totalDespesas);

            doc.add(new Paragraph("Resumo").setBold().setFontSize(13));
            Table resumo = new Table(UnitValue.createPercentArray(new float[]{1, 1, 1, 1}))
                    .useAllAvailableWidth();
            resumo.addCell(cardResumo("Transações", String.valueOf(transacoes.size()), ColorConstants.DARK_GRAY));
            resumo.addCell(cardResumo("Receitas", "R$ " + totalReceitas, VERDE));
            resumo.addCell(cardResumo("Despesas", "R$ " + totalDespesas, VERMELHO));
            resumo.addCell(cardResumo("Saldo", "R$ " + saldo,
                    saldo.compareTo(BigDecimal.ZERO) >= 0 ? VERDE : VERMELHO));
            doc.add(resumo);

            doc.add(new Paragraph("\n"));

            doc.add(new Paragraph("Transações").setBold().setFontSize(13));

            if (transacoes.isEmpty()) {
                doc.add(new Paragraph("Nenhuma transação encontrada no período.")
                        .setItalic().setFontColor(ColorConstants.GRAY));
            } else {
                Table tabela = new Table(UnitValue.createPercentArray(new float[]{2, 4, 3, 2, 2.5f}))
                        .useAllAvailableWidth();
                tabela.addHeaderCell(cabecalhoTabela("Data"));
                tabela.addHeaderCell(cabecalhoTabela("Descrição"));
                tabela.addHeaderCell(cabecalhoTabela("Categoria"));
                tabela.addHeaderCell(cabecalhoTabela("Tipo"));
                tabela.addHeaderCell(cabecalhoTabela("Valor"));

                for (Transacao t : transacoes) {
                    tabela.addCell(celulaTabela(t.getData().format(FMT_DATA)));
                    tabela.addCell(celulaTabela(t.getDescricao() != null ? t.getDescricao() : "-"));
                    tabela.addCell(celulaTabela(t.getCategoria() != null ? t.getCategoria().getNome() : "-"));
                    tabela.addCell(celulaTabela(t.getTipo().name()));
                    String sinal = t.getTipo() == TipoTransacao.DESPESA ? "- " : "+ ";
                    Cell valorCell = celulaTabela(sinal + "R$ " + t.getValor());
                    valorCell.setFontColor(t.getTipo() == TipoTransacao.DESPESA ? VERMELHO : VERDE);
                    tabela.addCell(valorCell);
                }
                doc.add(tabela);
            }

            Map<String, BigDecimal> porCategoria = transacoes.stream()
                    .filter(t -> t.getTipo() == TipoTransacao.DESPESA)
                    .collect(Collectors.groupingBy(
                            t -> t.getCategoria() != null ? t.getCategoria().getNome() : "Sem categoria",
                            Collectors.reducing(BigDecimal.ZERO, Transacao::getValor, BigDecimal::add)
                    ));

            if (!porCategoria.isEmpty()) {
                doc.add(new Paragraph("\n"));
                doc.add(new Paragraph("Despesas por categoria").setBold().setFontSize(13));
                Table catTable = new Table(UnitValue.createPercentArray(new float[]{3, 2, 2}))
                        .useAllAvailableWidth();
                catTable.addHeaderCell(cabecalhoTabela("Categoria"));
                catTable.addHeaderCell(cabecalhoTabela("Total"));
                catTable.addHeaderCell(cabecalhoTabela("% do total"));

                porCategoria.entrySet().stream()
                        .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
                        .forEach(e -> {
                            catTable.addCell(celulaTabela(e.getKey()));
                            catTable.addCell(celulaTabela("R$ " + e.getValue()));
                            BigDecimal percentual = totalDespesas.compareTo(BigDecimal.ZERO) > 0
                                    ? e.getValue().multiply(new BigDecimal("100"))
                                            .divide(totalDespesas, 1, java.math.RoundingMode.HALF_UP)
                                    : BigDecimal.ZERO;
                            catTable.addCell(celulaTabela(percentual + "%"));
                        });
                doc.add(catTable);
            }

            doc.add(new Paragraph("\n"));
            doc.add(new Paragraph("Prospera — Controle financeiro simples e poderoso")
                    .setFontSize(9).setFontColor(ColorConstants.GRAY).setTextAlignment(TextAlignment.CENTER));

        } catch (Exception e) {
            throw new NegocioExcecao("Erro ao gerar PDF: " + e.getMessage());
        }

        return baos.toByteArray();
    }

    private Paragraph infoLinha(String rotulo, String valor) {
        return new Paragraph()
                .add(new com.itextpdf.layout.element.Text(rotulo + " ").setBold())
                .add(valor).setFontSize(11);
    }

    private Cell cardResumo(String rotulo, String valor, com.itextpdf.kernel.colors.Color cor) {
        Cell c = new Cell().setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 1)).setPadding(10);
        c.add(new Paragraph(rotulo).setFontSize(9).setFontColor(ColorConstants.GRAY));
        c.add(new Paragraph(valor).setFontSize(12).setBold().setFontColor(cor));
        return c;
    }

    private Cell cabecalhoTabela(String texto) {
        Cell c = new Cell().setBackgroundColor(CINZA_CLARO).setPadding(8);
        c.add(new Paragraph(texto).setBold().setFontSize(10));
        return c;
    }

    private Cell celulaTabela(String texto) {
        Cell c = new Cell().setPadding(6);
        c.add(new Paragraph(texto).setFontSize(10));
        return c;
    }

    private String formatarPeriodo(LocalDate inicio, LocalDate fim) {
        if (inicio == null && fim == null) return "Todas as transações";
        if (inicio != null && fim != null) return inicio.format(FMT_DATA) + " até " + fim.format(FMT_DATA);
        if (inicio != null) return "A partir de " + inicio.format(FMT_DATA);
        return "Até " + fim.format(FMT_DATA);
    }
}