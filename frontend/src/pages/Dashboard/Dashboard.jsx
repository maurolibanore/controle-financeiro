import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useCarteira } from '../../context/CarteiraContext';
import TransacaoService from '../../services/TransacaoService';
import './Dashboard.css';

const transacaoService = new TransacaoService();

const Dashboard = () => {
    const { usuario, logout } = useAuth();
    const { carteiraAtiva, carteiras, carregarCarteiras } = useCarteira();
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [resumo, setResumo] = useState(null);
    const [transacoes, setTransacoes] = useState([]);

    useEffect(() => {
        if (carteiras.length === 0) {
            carregarCarteiras();
        }
    }, []);

    useEffect(() => {
        if (carteiraAtiva) {
            carregarDados();
        } else if (carteiras.length === 0) {
            setCarregando(false);
        }
    }, [carteiraAtiva]);

    const carregarDados = async () => {
        setCarregando(true);
        setErro('');
        try {
            const respostaResumo = await transacaoService.buscarResumo(carteiraAtiva.id);
            setResumo(respostaResumo.data);

            const respostaTransacoes = await transacaoService.buscarTransacoes(carteiraAtiva.id, {
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

    const realizarLogout = () => {
        logout();
        navigate('/login');
    };

    // prepara dados do graf a partir do resumo por categoria
    const dadosGrafico = (() => {
        if (!resumo?.porCategoria) return [];

        return resumo.porCategoria.map(cat => ({
            nome: cat.categoriaNome || 'Sem categoria',
            valor: Number(cat.total),
            tipo: cat.tipo
        }));
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
                    <button className="prospera-nav-item" onClick={() => navigate('/app/categorias')}>
                        <i className="pi pi-tags"></i>
                        <span>Categorias</span>
                    </button>
                    <button className="prospera-nav-item" onClick={() => navigate('/app/carteiras')}>
                        <i className="pi pi-briefcase"></i>
                        <span>Carteiras</span>
                    </button>
                    <button className="prospera-nav-item" onClick={() => navigate('/app/compartilhamento')}>
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
                            {carteiraAtiva ? `Carteira: ${carteiraAtiva.nome}` : 'Nenhuma carteira ativa'}
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

                {!carteiraAtiva ? (
                    <div style={{ background: '#fef3c7', color: '#92400e', padding: 24, borderRadius: 10, textAlign: 'center' }}>
                        <p style={{ margin: '0 0 12px', fontWeight: 600 }}>Nenhuma carteira ativa</p>
                        <p style={{ margin: '0 0 16px' }}>Ative uma carteira para visualizar o dashboard.</p>
                        <button
                            onClick={() => navigate('/app/carteiras')}
                            style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
                        >
                            Ir para Carteiras
                        </button>
                    </div>
                ) : (
                    <>
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
                                            <h2>Movimentação por Categoria</h2>
                                            <p>Receitas em verde, despesas em cinza</p>
                                        </div>
                                        <ResponsiveContainer width="100%" height={320}>
                                            <BarChart data={dadosGrafico}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecef" />
                                                <XAxis dataKey="nome" stroke="#6b7280" />
                                                <YAxis stroke="#6b7280" />
                                                <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                                                <Bar dataKey="valor" name="Valor" radius={[8, 8, 0, 0]}>
                                                    {dadosGrafico.map((entry, index) => (
                                                        <Cell key={index} fill={entry.tipo === 'RECEITA' ? '#16a34a' : '#94a3b8'} />
                                                    ))}
                                                </Bar>
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
                    </>
                )}

            </main>
        </div>
    );
};

export default Dashboard;