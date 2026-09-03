import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useAuth } from '../../context/AuthContext';
import { useCarteira } from '../../context/CarteiraContext';
import TransacaoService from '../../services/TransacaoService';
import CategoriaService from '../../services/CategoriaService';
import './Transacoes.css';

const transacaoService = new TransacaoService();
const categoriaService = new CategoriaService();

const Transacoes = () => {
    const { usuario, logout } = useAuth();
    const { carteiraAtiva, carteiras, carregarCarteiras } = useCarteira();
    const navigate = useNavigate();
    const toast = useRef(null);

    const [carregando, setCarregando] = useState(true);
    const [transacoes, setTransacoes] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [filtroTipo, setFiltroTipo] = useState(null);

    // Modal
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editando, setEditando] = useState(false);
    const [transacao, setTransacao] = useState(estadoInicial());
    const [salvando, setSalvando] = useState(false);

    function estadoInicial() {
        return {
            id: null,
            tipo: 'DESPESA',
            valor: null,
            descricao: '',
            data: new Date(),
            categoriaId: null
        };
    }

    useEffect(() => {
        if (carteiras.length === 0) {
            carregarCarteiras();
        }
        carregarCategorias();
    }, []);

    useEffect(() => {
        if (carteiraAtiva) {
            carregarTransacoes();
        } else {
            setCarregando(false);
        }
    }, [filtroTipo, carteiraAtiva]);

    const carregarCategorias = async () => {
        try {
            const resposta = await categoriaService.buscarTodos();
            setCategorias(resposta.data);
        } catch (erro) {
            console.error('Erro ao carregar categorias:', erro);
        }
    };

    const carregarTransacoes = async () => {
        setCarregando(true);
        try {
            const params = { page: 0, size: 50, sort: 'data,desc' };
            if (filtroTipo) params.tipo = filtroTipo;

            const resposta = await transacaoService.buscarTransacoes(carteiraAtiva.id, params);
            setTransacoes(resposta.data.content);
        } catch (erro) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar transações.' });
        } finally {
            setCarregando(false);
        }
    };

    const abrirNovaTransacao = () => {
        setTransacao(estadoInicial());
        setEditando(false);
        setDialogVisible(true);
    };

    const abrirEditar = (item) => {
        setTransacao({
            id: item.id,
            tipo: item.tipo,
            valor: Number(item.valor),
            descricao: item.descricao || '',
            data: new Date(item.data),
            categoriaId: item.categoriaId
        });
        setEditando(true);
        setDialogVisible(true);
    };

    const fecharDialog = () => {
        setDialogVisible(false);
    };

    const salvarTransacao = async () => {
        if (!transacao.valor || transacao.valor <= 0) {
            toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Informe um valor válido.' });
            return;
        }

        setSalvando(true);
        try {
            const dados = {
                tipo: transacao.tipo,
                valor: transacao.valor,
                descricao: transacao.descricao,
                data: transacao.data.toISOString().split('T')[0],
                categoriaId: transacao.categoriaId
            };

            if (editando) {
                await transacaoService.atualizarTransacao(carteiraAtiva.id, transacao.id, dados);
                toast.current.show({ severity: 'success', summary: 'Atualizado', detail: 'Transação atualizada.' });
            } else {
                await transacaoService.inserirTransacao(carteiraAtiva.id, dados);
                toast.current.show({ severity: 'success', summary: 'Criado', detail: 'Transação criada.' });
            }

            fecharDialog();
            carregarTransacoes();
        } catch (erro) {
            const mensagem = erro?.response?.data?.mensagem || 'Erro ao salvar.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: mensagem });
        } finally {
            setSalvando(false);
        }
    };

    const confirmarExcluir = (item) => {
        confirmDialog({
            message: `Remover a transação "${item.descricao || 'sem descrição'}"?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => excluir(item)
        });
    };

    const excluir = async (item) => {
        try {
            await transacaoService.deletarTransacao(carteiraAtiva.id, item.id);
            toast.current.show({ severity: 'success', summary: 'Removido', detail: 'Transação removida.' });
            carregarTransacoes();
        } catch (erro) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao remover.' });
        }
    };

    const realizarLogout = () => {
        logout();
        navigate('/login');
    };

    // cat filtradas pelo tipo da transacao atual 
    const categoriasFiltradas = categorias
        .filter(c => c.tipo === transacao.tipo)
        .map(c => ({ label: c.nome, value: c.id }));

    const opcoesTipo = [
        { label: 'Todos', value: null },
        { label: 'Receitas', value: 'RECEITA' },
        { label: 'Despesas', value: 'DESPESA' }
    ];

    const rodapeDialog = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={fecharDialog} />
            <Button label={salvando ? 'Salvando...' : 'Salvar'} icon="pi pi-check" onClick={salvarTransacao} disabled={salvando} />
        </div>
    );

    return (
        <div className="prospera-layout">
            <Toast ref={toast} />
            <ConfirmDialog />

            <aside className="prospera-sidebar">
                <div className="prospera-logo">
                    <span className="prospera-logo-icon">P</span>
                    <span className="prospera-logo-text">Prospera</span>
                </div>

                <nav className="prospera-nav">
                    <button className="prospera-nav-item" onClick={() => navigate('/app/dashboard')}>
                        <i className="pi pi-home"></i>
                        <span>Dashboard</span>
                    </button>
                    <button className="prospera-nav-item active">
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
                        <h1 className="prospera-title">Transações</h1>
                        <p className="prospera-subtitle">
                            {carteiraAtiva ? `Carteira: ${carteiraAtiva.nome}` : 'Nenhuma carteira ativa'}
                        </p>
                    </div>
                    <div className="prospera-user">
                        <div className="prospera-avatar">{usuario?.nome?.charAt(0).toUpperCase()}</div>
                        <div>
                            <p className="prospera-user-name">{usuario?.nome}</p>
                            <p className="prospera-user-email">{usuario?.email}</p>
                        </div>
                    </div>
                </header>

                {!carteiraAtiva ? (
                    <div style={{ background: '#fef3c7', color: '#92400e', padding: 24, borderRadius: 10, textAlign: 'center' }}>
                        <p style={{ margin: '0 0 12px', fontWeight: 600 }}>Nenhuma carteira ativa</p>
                        <p style={{ margin: '0 0 16px' }}>Ative uma carteira para gerenciar transações.</p>
                        <button 
                            onClick={() => navigate('/app/carteiras')}
                            style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
                        >
                            Ir para Carteiras
                        </button>
                    </div>
                ) : (
                    <section className="prospera-panel">
                        <div className="transacoes-toolbar">
                            <Dropdown
                                value={filtroTipo}
                                options={opcoesTipo}
                                onChange={(e) => setFiltroTipo(e.value)}
                                placeholder="Filtrar por tipo"
                                className="w-15rem"
                            />
                            <Button
                                label="Nova Transação"
                                icon="pi pi-plus"
                                onClick={abrirNovaTransacao}
                                className="prospera-btn-primary"
                            />
                        </div>

                        {carregando ? (
                            <div className="prospera-loading-inline">
                                <ProgressSpinner style={{ width: 40, height: 40 }} />
                            </div>
                        ) : transacoes.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#6b7280', padding: 32 }}>
                                Nenhuma transação encontrada.
                            </p>
                        ) : (
                            <table className="prospera-table">
                                <thead>
                                    <tr>
                                        <th>Descrição</th>
                                        <th>Categoria</th>
                                        <th>Data</th>
                                        <th style={{ textAlign: 'right' }}>Valor</th>
                                        <th style={{ textAlign: 'center' }}>Ações</th>
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
                                                <td style={{ textAlign: 'center' }}>
                                                    <Button
                                                        icon="pi pi-pencil"
                                                        className="p-button-rounded p-button-text"
                                                        onClick={() => abrirEditar(item)}
                                                    />
                                                    <Button
                                                        icon="pi pi-trash"
                                                        className="p-button-rounded p-button-text p-button-danger"
                                                        onClick={() => confirmarExcluir(item)}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </section>
                )}
            </main>

            <Dialog
                visible={dialogVisible}
                header={editando ? 'Editar Transação' : 'Nova Transação'}
                onHide={fecharDialog}
                style={{ width: '500px' }}
                footer={rodapeDialog}
                modal
            >
                <div className="transacao-form">
                    <div className="auth-field">
                        <label>Tipo</label>
                        <Dropdown
                            value={transacao.tipo}
                            options={[
                                { label: 'Receita', value: 'RECEITA' },
                                { label: 'Despesa', value: 'DESPESA' }
                            ]}
                            onChange={(e) => setTransacao({ ...transacao, tipo: e.value, categoriaId: null })}
                        />
                    </div>

                    <div className="auth-field">
                        <label>Valor</label>
                        <InputNumber
                            value={transacao.valor}
                            onValueChange={(e) => setTransacao({ ...transacao, valor: e.value })}
                            mode="currency"
                            currency="BRL"
                            locale="pt-BR"
                        />
                    </div>

                    <div className="auth-field">
                        <label>Descrição</label>
                        <InputText
                            value={transacao.descricao}
                            onChange={(e) => setTransacao({ ...transacao, descricao: e.target.value })}
                            placeholder="Ex: Mercado, Salário..."
                        />
                    </div>

                    <div className="auth-field">
                        <label>Data</label>
                        <Calendar
                            value={transacao.data}
                            onChange={(e) => setTransacao({ ...transacao, data: e.value })}
                            dateFormat="dd/mm/yy"
                            showIcon
                        />
                    </div>

                    <div className="auth-field">
                        <label>Categoria (opcional)</label>
                        <Dropdown
                            value={transacao.categoriaId}
                            options={categoriasFiltradas}
                            onChange={(e) => setTransacao({ ...transacao, categoriaId: e.value })}
                            placeholder="Selecione..."
                            showClear
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Transacoes;