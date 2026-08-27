import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import CarteiraService from '../../services/CarteiraService';
import TransacaoService from '../../services/TransacaoService';
import './Dashboard.css';

const carteiraService = new CarteiraService();
const transacaoService = new TransacaoService();

const Dashboard = () => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [carteira, setCarteira] = useState(null);
    const [resumo, setResumo] = useState(null);
    const [transacoes, setTransacoes] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const respostaCarteiras = await carteiraService.buscarTodos();
                const carteiras = respostaCarteiras.data;

                if (carteiras.length === 0) {
                    setErro('Você não possui nenhuma carteira.');
                    setCarregando(false);
                    return;
                }

                const carteiraAtual = carteiras[0];
                setCarteira(carteiraAtual);

                const respostaResumo = await transacaoService.buscarResumo(carteiraAtual.id);
                setResumo(respostaResumo.data);

                const respostaTransacoes = await transacaoService.buscarTransacoes(carteiraAtual.id, {
                    page: 0,
                    size: 6,
                    sort: 'data,desc'
                });
                setTransacoes(respostaTransacoes.data.content);

            } catch (erroCarregar) {
                console.error(erroCarregar);
                setErro('Erro ao carregar dados do dashboard.');
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, []);

    const realizarLogout = () => {
        logout();
        navigate('/login');
    };

    // prepara dados do graf a partir do resumo por categoria
    const dadosGrafico = (() => {
        if (!resumo?.porCategoria) return [];
        
        const agrupado = {};
        resumo.porCategoria.forEach(cat => {
            const nome = cat.categoriaNome || 'Sem categoria';
            if (!agrupado[nome]) {
                agrupado[nome] = { nome, receitas: 0, despesas: 0 };
            }
            if (cat.tipo === 'RECEITA') {
                agrupado[nome].receitas += Number(cat.total);
            } else {
                agrupado[nome].despesas += Number(cat.total);
            }
        });
        
        return Object.values(agrupado);
    })();

    if (carregando) {
        return (
            <div className="prospera-loading">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="prospera-layout">

            <aside className="prospera-sidebar">
                <div className="prospera-logo">
                    <span className="prospera-logo-icon">P</span>
                    <span className="prospera-logo-text">Prospera</span>
                </div>

                <nav className="prospera-nav">
                    <button className="prospera-nav-item active">
                        <i className="pi pi-home"></i>
                        <span>Dashboard</span>
                    </button>
                    <button className="prospera-nav-item" onClick={() => navigate('/app/transacoes')}>
                        <i className="pi pi-wallet"></i>
                        <span>Transações</span>
                    </button>
                    <button className="prospera-nav-item">
                        <i className="pi pi-users"></i>
                        <span>Compartilhamento</span>
                    </button>
                    <button className="prospera-nav-item" onClick={() => navigate('/app/perfil')}>
                        <i className="pi pi-user"></i>
                        <span>Perfil</span>
                    </button>
                </nav>

                <div className="prospera-sidebar-footer">
                    <button className="prospera-nav-item logout" onClick={realizarLogout}>
                        <i className="pi pi-sign-out"></i>
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            <main className="prospera-main">

                <header className="prospera-header">
                    <div>
                        <h1 className="prospera-title">Dashboard</h1>
                        <p className="prospera-subtitle">
                            {carteira ? `Carteira: ${carteira.nome}` : 'Visão geral das suas finanças'}
                        </p>
                    </div>
                    <div className="prospera-user">
                        <div className="prospera-avatar">
                            {usuario?.nome?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="prospera-user-name">{usuario?.nome}</p>
                            <p className="prospera-user-email">{usuario?.email}</p>
                        </div>
                    </div>
                </header>

                {erro && (
                    <div style={{ background: '#fef2f2', color: '#dc2626', padding: 16, borderRadius: 10, marginBottom: 24 }}>
                        {erro}
                    </div>
                )}

                {resumo && (
                    <>
                        <section className="prospera-cards">
                            <div className="prospera-card">
                                <div className="prospera-card-icon saldo">
                                    <i className="pi pi-dollar"></i>
                                </div>
                                <div>
                                    <p className="prospera-card-label">Saldo Atual</p>
                                    <p className="prospera-card-value">R$ {Number(resumo.saldo).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="prospera-card">
                                <div className="prospera-card-icon receita">
                                    <i className="pi pi-arrow-up"></i>
                                </div>
                                <div>
                                    <p className="prospera-card-label">Receitas</p>
                                    <p className="prospera-card-value">R$ {Number(resumo.totalReceitas).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="prospera-card">
                                <div className="prospera-card-icon despesa">
                                    <i className="pi pi-arrow-down"></i>
                                </div>
                                <div>
                                    <p className="prospera-card-label">Despesas</p>
                                    <p className="prospera-card-value">R$ {Number(resumo.totalDespesas).toFixed(2)}</p>
                                </div>
                            </div>
                        </section>

                        {dadosGrafico.length > 0 && (
                            <section className="prospera-panel">
                                <div className="prospera-panel-header">
                                    <h2>Receitas x Despesas por Categoria</h2>
                                    <p>Visão consolidada por categoria</p>
                                </div>
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={dadosGrafico}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e8ecef" />
                                        <XAxis dataKey="nome" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                                        <Legend />
                                        <Bar dataKey="receitas" name="Receitas" fill="#16a34a" radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="despesas" name="Despesas" fill="#94a3b8" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </section>
                        )}
                    </>
                )}

                <section className="prospera-panel">
                    <div className="prospera-panel-header">
                        <h2>Lançamentos Recentes</h2>
                        <p>Últimas movimentações</p>
                    </div>
                    {transacoes.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#6b7280', padding: 32 }}>
                            Nenhuma transação cadastrada ainda.
                        </p>
                    ) : (
                        <table className="prospera-table">
                            <thead>
                                <tr>
                                    <th>Descrição</th>
                                    <th>Categoria</th>
                                    <th>Data</th>
                                    <th style={{ textAlign: 'right' }}>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transacoes.map((item) => {
                                    const tipo = item.tipo.toLowerCase();
                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="prospera-lancamento-desc">
                                                    <span className={`prospera-badge ${tipo}`}>
                                                        <i className={`pi ${tipo === 'receita' ? 'pi-arrow-up' : 'pi-arrow-down'}`}></i>
                                                    </span>
                                                    {item.descricao || '(sem descrição)'}
                                                </div>
                                            </td>
                                            <td className="prospera-lancamento-data">{item.categoriaNome || '-'}</td>
                                            <td className="prospera-lancamento-data">
                                                {new Date(item.data).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className={`prospera-lancamento-valor ${tipo}`}>
                                                {tipo === 'despesa' ? '- ' : '+ '}
                                                R$ {Number(item.valor).toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </section>

            </main>
        </div>
    );
};

export default Dashboard;