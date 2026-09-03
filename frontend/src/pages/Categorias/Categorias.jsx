import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from '../../context/AuthContext';
import CategoriaService from '../../services/CategoriaService';
import './Categorias.css';

const categoriaService = new CategoriaService();

const Categorias = () => {
    const navigate = useNavigate();
    const { usuario, logout } = useAuth();
    const toast = useRef(null);

    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [filtroTipo, setFiltroTipo] = useState(null);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [editando, setEditando] = useState(false);
    const [categoria, setCategoria] = useState(estadoInicial());
    const [salvando, setSalvando] = useState(false);

    function estadoInicial() {
        return {
            id: null,
            nome: '',
            tipo: 'DESPESA',
            cor: '#16a34a'
        };
    }

    useEffect(() => {
        carregarCategorias();
    }, []);

    const carregarCategorias = async () => {
        setCarregando(true);
        try {
            const resposta = await categoriaService.buscarTodos();
            setCategorias(resposta.data);
        } catch (erro) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar categorias.' });
        } finally {
            setCarregando(false);
        }
    };

    const abrirNovaCategoria = () => {
        setCategoria(estadoInicial());
        setEditando(false);
        setDialogVisible(true);
    };

    const abrirEditar = (item) => {
        setCategoria({
            id: item.id,
            nome: item.nome,
            tipo: item.tipo,
            cor: item.cor || '#16a34a'
        });
        setEditando(true);
        setDialogVisible(true);
    };

    const salvarCategoria = async () => {
        if (!categoria.nome || categoria.nome.trim().length === 0) {
            toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Informe o nome da categoria.' });
            return;
        }

        setSalvando(true);
        try {
            if (editando) {
                await categoriaService.atualizarCategoria(categoria.id, categoria);
                toast.current.show({ severity: 'success', summary: 'Atualizado', detail: 'Categoria atualizada.' });
            } else {
                await categoriaService.inserir(categoria);
                toast.current.show({ severity: 'success', summary: 'Criado', detail: 'Categoria criada.' });
            }

            setDialogVisible(false);
            carregarCategorias();
        } catch (erro) {
            const mensagem = erro?.response?.data?.mensagem || 'Erro ao salvar.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: mensagem });
        } finally {
            setSalvando(false);
        }
    };

    const confirmarExcluir = (item) => {
        confirmDialog({
            message: `Remover a categoria "${item.nome}"?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => excluir(item)
        });
    };

    const excluir = async (item) => {
        try {
            await categoriaService.deletarCategoria(item.id);
            toast.current.show({ severity: 'success', summary: 'Removido', detail: 'Categoria removida.' });
            carregarCategorias();
        } catch (erro) {
            const mensagem = erro?.response?.data?.mensagem || 'Erro ao remover.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: mensagem });
        }
    };

    const realizarLogout = () => {
        logout();
        navigate('/login');
    };

    const categoriasFiltradas = filtroTipo
        ? categorias.filter(c => c.tipo === filtroTipo)
        : categorias;

    const opcoesTipo = [
        { label: 'Todos', value: null },
        { label: 'Receitas', value: 'RECEITA' },
        { label: 'Despesas', value: 'DESPESA' }
    ];

    const rodapeDialog = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setDialogVisible(false)} />
            <Button label={salvando ? 'Salvando...' : 'Salvar'} icon="pi pi-check" onClick={salvarCategoria} disabled={salvando} />
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
                    <button className="prospera-nav-item" onClick={() => navigate('/app/transacoes')}>
                        <i className="pi pi-wallet"></i>
                        <span>Transações</span>
                    </button>
                    <button className="prospera-nav-item active">
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
                        <h1 className="prospera-title">Categorias</h1>
                        <p className="prospera-subtitle">Organize suas receitas e despesas</p>
                    </div>
                    <div className="prospera-user">
                        <div className="prospera-avatar">{usuario?.nome?.charAt(0).toUpperCase()}</div>
                        <div>
                            <p className="prospera-user-name">{usuario?.nome}</p>
                            <p className="prospera-user-email">{usuario?.email}</p>
                        </div>
                    </div>
                </header>

                <section className="prospera-panel">
                    <div className="categorias-toolbar">
                        <Dropdown
                            value={filtroTipo}
                            options={opcoesTipo}
                            onChange={(e) => setFiltroTipo(e.value)}
                            placeholder="Filtrar por tipo"
                            className="w-15rem"
                        />
                        <Button
                            label="Nova Categoria"
                            icon="pi pi-plus"
                            onClick={abrirNovaCategoria}
                            className="prospera-btn-primary"
                        />
                    </div>

                    {carregando ? (
                        <div className="prospera-loading-inline">
                            <ProgressSpinner style={{ width: 40, height: 40 }} />
                        </div>
                    ) : categoriasFiltradas.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#6b7280', padding: 32 }}>
                            Nenhuma categoria cadastrada.
                        </p>
                    ) : (
                        <div className="categorias-grid">
                            {categoriasFiltradas.map((item) => (
                                <div key={item.id} className="categoria-card">
                                    <div className="categoria-icone" style={{ background: item.cor + '20', color: item.cor }}>
                                        <i className={`pi ${item.icone || 'pi-tag'}`}></i>
                                    </div>
                                    <div className="categoria-info">
                                        <h3>{item.nome}</h3>
                                        <span className={`categoria-tipo ${item.tipo.toLowerCase()}`}>
                                            {item.tipo === 'RECEITA' ? 'Receita' : 'Despesa'}
                                        </span>
                                    </div>
                                    <div className="categoria-acoes">
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Dialog
                visible={dialogVisible}
                header={editando ? 'Editar Categoria' : 'Nova Categoria'}
                onHide={() => setDialogVisible(false)}
                style={{ width: '500px' }}
                footer={rodapeDialog}
                modal
            >
                <div className="transacao-form">
                    <div className="auth-field">
                        <label>Nome</label>
                        <InputText
                            value={categoria.nome}
                            onChange={(e) => setCategoria({ ...categoria, nome: e.target.value })}
                            placeholder="Ex: Alimentação, Salário..."
                        />
                    </div>

                    <div className="auth-field">
                        <label>Tipo</label>
                        <Dropdown
                            value={categoria.tipo}
                            options={[
                                { label: 'Receita', value: 'RECEITA' },
                                { label: 'Despesa', value: 'DESPESA' }
                            ]}
                            onChange={(e) => setCategoria({ ...categoria, tipo: e.value })}
                        />
                    </div>

                    <div className="auth-field">
                        <label>Cor</label>
                        <input
                            type="color"
                            value={categoria.cor}
                            onChange={(e) => setCategoria({ ...categoria, cor: e.target.value })}
                            style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1px solid #d1d5db', cursor: 'pointer' }}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Categorias;