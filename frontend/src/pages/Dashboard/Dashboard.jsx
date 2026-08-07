import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const dadosMock = {
    resumo: {
        saldo: 2450.00,
        receitas: 5000.00,
        despesas: 2550.00
    },
    grafico: [
        { mes: 'Mar', receitas: 4200, despesas: 3100 },
        { mes: 'Abr', receitas: 3800, despesas: 2900 },
        { mes: 'Mai', receitas: 5100, despesas: 3400 },
        { mes: 'Jun', receitas: 4700, despesas: 2800 },
        { mes: 'Jul', receitas: 5300, despesas: 3200 },
        { mes: 'Ago', receitas: 5000, despesas: 2550 },
    ],
    lancamentos: [
        { id: 1, descricao: 'Salário', valor: 4000.00, data: '01/08/2026', tipo: 'receita' },
        { id: 2, descricao: 'Freelance', valor: 1000.00, data: '03/08/2026', tipo: 'receita' },
        { id: 3, descricao: 'Aluguel', valor: 900.00, data: '05/08/2026', tipo: 'despesa' },
        { id: 4, descricao: 'Mercado', valor: 450.00, data: '06/08/2026', tipo: 'despesa' },
        { id: 5, descricao: 'Internet', valor: 100.00, data: '07/08/2026', tipo: 'despesa' },
        { id: 6, descricao: 'Streaming', valor: 50.00, data: '08/08/2026', tipo: 'despesa' },
    ]
};

const Dashboard = () => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(true);
    const [dados, setDados] = useState(null);

    useEffect(() => {
        const carregarDados = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setDados(dadosMock);
            setCarregando(false);
        };
        carregarDados();
    }, []);

    const realizarLogout = () => {
        logout();
        navigate('/login');
    };

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
                    <button className="prospera-nav-item">
                        <i className="pi pi-wallet"></i>
                        <span>Transações</span>
                    </button>
                    <button className="prospera-nav-item">
                        <i className="pi pi-users"></i>
                        <span>Compartilhamento</span>
                    </button>
                    <button className="prospera-nav-item" onClick={() => navigate('/app/perfil/senha')}>
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
                        <p className="prospera-subtitle">Visão geral das suas finanças</p>
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

                <section className="prospera-cards">
                    <div className="prospera-card">
                        <div className="prospera-card-icon saldo">
                            <i className="pi pi-dollar"></i>
                        </div>
                        <div>
                            <p className="prospera-card-label">Saldo Atual</p>
                            <p className="prospera-card-value">R$ {dados.resumo.saldo.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="prospera-card">
                        <div className="prospera-card-icon receita">
                            <i className="pi pi-arrow-up"></i>
                        </div>
                        <div>
                            <p className="prospera-card-label">Receitas do Mês</p>
                            <p className="prospera-card-value">R$ {dados.resumo.receitas.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="prospera-card">
                        <div className="prospera-card-icon despesa">
                            <i className="pi pi-arrow-down"></i>
                        </div>
                        <div>
                            <p className="prospera-card-label">Despesas do Mês</p>
                            <p className="prospera-card-value">R$ {dados.resumo.despesas.toFixed(2)}</p>
                        </div>
                    </div>
                </section>

                <section className="prospera-panel">
                    <div className="prospera-panel-header">
                        <h2>Receitas x Despesas</h2>
                        <p>Últimos 6 meses</p>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={dados.grafico}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e8ecef" />
                            <XAxis dataKey="mes" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                            <Legend />
                            <Bar dataKey="receitas" name="Receitas" fill="#16a34a" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="despesas" name="Despesas" fill="#94a3b8" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </section>

                <section className="prospera-panel">
                    <div className="prospera-panel-header">
                        <h2>Lançamentos Recentes</h2>
                        <p>Últimas movimentações</p>
                    </div>
                    <table className="prospera-table">
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Data</th>
                                <th style={{ textAlign: 'right' }}>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dados.lancamentos.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="prospera-lancamento-desc">
                                            <span className={`prospera-badge ${item.tipo}`}>
                                                <i className={`pi ${item.tipo === 'receita' ? 'pi-arrow-up' : 'pi-arrow-down'}`}></i>
                                            </span>
                                            {item.descricao}
                                        </div>
                                    </td>
                                    <td className="prospera-lancamento-data">{item.data}</td>
                                    <td className={`prospera-lancamento-valor ${item.tipo}`}>
                                        {item.tipo === 'despesa' ? '- ' : '+ '}
                                        R$ {item.valor.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

            </main>
        </div>
    );
};

export default Dashboard;