import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import InsightService from '../services/InsightService';

const insightService = new InsightService();

const MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const ANOS = [2024, 2025, 2026, 2027];

const ModalInsights = ({ visivel, aoFechar, carteiraId }) => {
    const [carregando, setCarregando] = useState(false);
    const [insights, setInsights] = useState(null);
    const [erro, setErro] = useState('');
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [ano, setAno] = useState(new Date().getFullYear());

    const resetar = () => {
        setInsights(null);
        setErro('');
        setMes(new Date().getMonth() + 1);
        setAno(new Date().getFullYear());
    };

    const aoFecharModal = () => {
        resetar();
        aoFechar();
    };

    const gerarAnalise = async () => {
        setCarregando(true);
        setErro('');
        setInsights(null);
        try {
            const resposta = await insightService.gerarInsights(carteiraId, mes, ano);
            setInsights(resposta.data);
        } catch (e) {
            const mensagem = e?.response?.data?.mensagem || 'Erro ao gerar análise. Tente novamente.';
            setErro(mensagem);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <Dialog
            header={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <i className="pi pi-sparkles" style={{ color: '#8b5cf6', fontSize: '1.4rem' }}></i>
                    <span>Análise com IA</span>
                </div>
            }
            visible={visivel}
            onHide={aoFecharModal}
            style={{ width: '90%', maxWidth: 650 }}
            modal
            dismissableMask
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {!insights && !carregando && (
                    <>
                        <p style={{ margin: 0, color: '#6b7280' }}>
                            Escolha o mês e o ano que quer analisar:
                        </p>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <select
                                value={mes}
                                onChange={(e) => setMes(Number(e.target.value))}
                                style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14 }}
                            >
                                {MESES.map((nome, i) => (
                                    <option key={i + 1} value={i + 1}>{nome}</option>
                                ))}
                            </select>
                            <select
                                value={ano}
                                onChange={(e) => setAno(Number(e.target.value))}
                                style={{ width: 120, padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14 }}
                            >
                                {ANOS.map((a) => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                        </div>

                        {erro && (
                            <div style={{ background: '#fef2f2', color: '#dc2626', padding: 12, borderRadius: 8, fontSize: 14 }}>
                                {erro}
                            </div>
                        )}

                        <Button
                            label="Gerar análise"
                            icon="pi pi-sparkles"
                            onClick={gerarAnalise}
                            style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', border: 'none', color: '#fff', fontWeight: 600 }}
                        />
                    </>
                )}

                {carregando && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 32 }}>
                        <ProgressSpinner style={{ width: 50, height: 50 }} />
                        <p style={{ margin: 0, color: '#6b7280', textAlign: 'center' }}>
                            A IA está analisando suas finanças...<br />
                            <span style={{ fontSize: 12 }}>Isso pode levar alguns segundos</span>
                        </p>
                    </div>
                )}

                {insights && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                            <div style={{ background: '#f0fdf4', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>Receitas</p>
                                <p style={{ margin: '4px 0 0', fontWeight: 700, color: '#16a34a' }}>R$ {Number(insights.totalReceitas).toFixed(2)}</p>
                            </div>
                            <div style={{ background: '#fef2f2', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>Despesas</p>
                                <p style={{ margin: '4px 0 0', fontWeight: 700, color: '#dc2626' }}>R$ {Number(insights.totalDespesas).toFixed(2)}</p>
                            </div>
                            <div style={{ background: '#eff6ff', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>Saldo</p>
                                <p style={{ margin: '4px 0 0', fontWeight: 700, color: Number(insights.saldo) >= 0 ? '#16a34a' : '#dc2626' }}>R$ {Number(insights.saldo).toFixed(2)}</p>
                            </div>
                        </div>

                        <div style={{ background: 'linear-gradient(135deg, #faf5ff, #fdf2f8)', padding: 20, borderRadius: 12, borderLeft: '4px solid #8b5cf6' }}>
                            <p style={{ margin: 0, color: '#1f2937', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                {insights.analise}
                            </p>
                        </div>

                        <Button
                            label="Nova análise"
                            icon="pi pi-refresh"
                            onClick={() => { setInsights(null); setErro(''); }}
                            outlined
                        />
                    </>
                )}

            </div>
        </Dialog>
    );
};

export default ModalInsights;