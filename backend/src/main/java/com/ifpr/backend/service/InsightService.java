package com.ifpr.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.dto.InsightResponseDTO;
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

@Service
public class InsightService {

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private CarteiraRepository carteiraRepository;

    @Autowired
    private CarteiraMembroRepository membroRepository;

    @Autowired
    private AuthUsuarioProvider authUsuarioProvider;

    @Autowired
    private GeminiService geminiService;

    public InsightResponseDTO gerarInsights(Long carteiraId, int mes, int ano) {
        // valida acesso à carteira
        Usuario usuarioLogado = authUsuarioProvider.getUsuarioAutenticado();
        Carteira carteira = carteiraRepository.findById(carteiraId)
                .orElseThrow(() -> new NaoEncontradoExcecao("Carteira não encontrada"));

        if (!membroRepository.existsByCarteiraAndUsuario(carteira, usuarioLogado)) {
            throw new NegocioExcecao("Você não é membro desta carteira");
        }

        YearMonth yearMonth = YearMonth.of(ano, mes);
        LocalDate dataInicio = yearMonth.atDay(1);
        LocalDate dataFim = yearMonth.atEndOfMonth();

        List<Transacao> transacoes = transacaoRepository.buscarPorCarteiraEPeriodo(
                carteira, dataInicio, dataFim);

        if (transacoes.isEmpty()) {
            throw new NegocioExcecao("Não há transações neste mês para analisar");
        }

        BigDecimal totalReceitas = transacoes.stream()
                .filter(t -> t.getTipo() == TipoTransacao.RECEITA)
                .map(Transacao::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDespesas = transacoes.stream()
                .filter(t -> t.getTipo() == TipoTransacao.DESPESA)
                .map(Transacao::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal saldo = totalReceitas.subtract(totalDespesas);

        String prompt = montarPrompt(carteira, yearMonth, totalReceitas, totalDespesas, saldo, transacoes);

        String analise = geminiService.gerarTexto(prompt);

        return new InsightResponseDTO(
                analise,
                mes,
                ano,
                totalReceitas,
                totalDespesas,
                saldo,
                transacoes.size()
        );
    }

    private String montarPrompt(Carteira carteira, YearMonth periodo,
                                BigDecimal totalReceitas, BigDecimal totalDespesas,
                                BigDecimal saldo, List<Transacao> transacoes) {

        String nomeMes = periodo.getMonth().getDisplayName(TextStyle.FULL, new Locale("pt", "BR"));

        StringBuilder sb = new StringBuilder();
        sb.append("Você é um assistente financeiro pessoal. Analise os dados abaixo ");
        sb.append("da carteira \"").append(carteira.getNome()).append("\" ");
        sb.append("no mês de ").append(nomeMes).append("/").append(periodo.getYear()).append(" ");
        sb.append("e gere insights úteis e práticos em português.\n\n");

        sb.append("RESUMO FINANCEIRO:\n");
        sb.append("- Total de receitas: R$ ").append(totalReceitas).append("\n");
        sb.append("- Total de despesas: R$ ").append(totalDespesas).append("\n");
        sb.append("- Saldo do mês: R$ ").append(saldo).append("\n");
        sb.append("- Total de transações: ").append(transacoes.size()).append("\n\n");

        sb.append("DESPESAS POR CATEGORIA:\n");
        transacoes.stream()
                .filter(t -> t.getTipo() == TipoTransacao.DESPESA)
                .collect(java.util.stream.Collectors.groupingBy(
                        t -> t.getCategoria() != null ? t.getCategoria().getNome() : "Sem categoria",
                        java.util.stream.Collectors.reducing(BigDecimal.ZERO, Transacao::getValor, BigDecimal::add)
                ))
                .forEach((cat, total) -> sb.append("- ").append(cat).append(": R$ ").append(total).append("\n"));

        sb.append("\nRECEITAS POR CATEGORIA:\n");
        transacoes.stream()
                .filter(t -> t.getTipo() == TipoTransacao.RECEITA)
                .collect(java.util.stream.Collectors.groupingBy(
                        t -> t.getCategoria() != null ? t.getCategoria().getNome() : "Sem categoria",
                        java.util.stream.Collectors.reducing(BigDecimal.ZERO, Transacao::getValor, BigDecimal::add)
                ))
                .forEach((cat, total) -> sb.append("- ").append(cat).append(": R$ ").append(total).append("\n"));

        sb.append("\nINSTRUÇÕES:\n");
        sb.append("Gere uma análise de 3 a 4 parágrafos curtos destacando:\n");
        sb.append("1. Como foi o mês em termos de saldo (positivo/negativo) e o que isso significa\n");
        sb.append("2. Qual categoria teve mais gastos e se isso é saudável\n");
        sb.append("3. Uma dica prática de economia específica para este usuário\n");
        sb.append("4. Um elogio ou motivação se for o caso\n\n");
        sb.append("IMPORTANTE:\n");
        sb.append("- Use linguagem amigável e pessoal (como se fosse um amigo dando conselho)\n");
        sb.append("- Seja específico com números e nomes de categorias\n");
        sb.append("- Não use markdown nem bullet points\n");
        sb.append("- Escreva em parágrafos de texto corrido\n");
        sb.append("- Máximo 300 palavras no total\n");

        return sb.toString();
    }
}