import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from '../../context/AuthContext';
import { useCarteira } from '../../context/CarteiraContext';
import CarteiraService from '../../services/CarteiraService';
import './Carteiras.css';

const carteiraService = new CarteiraService();

const Carteiras = () => {
    const navigate = useNavigate();
    const { usuario, logout } = useAuth();
    const { carteiras, carteiraAtiva, carregarCarteiras, selecionarCarteira } = useCarteira();
    const toast = useRef(null);

    const [inicializando, setInicializando] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editando, setEditando] = useState(false);
    const [carteira, setCarteira] = useState({ nome: '', descricao: '' });
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        (async () => {
            await carregarCarteiras();
            setInicializando(false);
        })();
    }, []);

    const abrirNovaCarteira = () => {
        setCarteira({ nome: '', descricao: '' });
        setEditando(false);
        setDialogVisible(true);
    };

    const abrirEditar = (item) => {
        setCarteira({ id: item.id, nome: item.nome, descricao: item.descricao || '' });
        setEditando(true);
        setDialogVisible(true);
    };

    const salvarCarteira = async () => {
        if (!carteira.nome || carteira.nome.trim().length === 0) {
            toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Informe o nome da carteira.' });
            return;
        }

        setSalvando(true);
        try {
            if (editando) {
                await carteiraService.atualizarCarteira(carteira.id, {
                    nome: carteira.nome,
                    descricao: carteira.descricao
                });
                toast.current.show({ severity: 'success', summary: 'Atualizado', detail: 'Carteira atualizada.' });
            } else {
                await carteiraService.inserir({
                    nome: carteira.nome,
                    descricao: carteira.descricao
                });
                toast.current.show({ severity: 'success', summary: 'Criado', detail: 'Carteira criada.' });
            }

            setDialogVisible(false);
            await carregarCarteiras();
        } catch (erro) {
            const mensagem = erro?.response?.data?.mensagem || 'Erro ao salvar.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: mensagem });
        } finally {
            setSalvando(false);
        }
    };

    const confirmarExcluir = (item) => {
        confirmDialog({
            message: `Remover a carteira "${item.nome}"? Todas as transações também serão apagadas.`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => excluir(item)
        });
    };

    const excluir = async (item) => {
        try {
            await carteiraService.deletarCarteira(item.id);
            toast.current.show({ severity: 'success', summary: 'Removido', detail: 'Carteira removida.' });
            await carregarCarteiras();
        } catch (erro) {
            const mensagem = erro?.response?.data?.mensagem || 'Erro ao remover.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: mensagem });
        }
    };

    const ativarCarteira = (item) => {
        selecionarCarteira(item);
        toast.current.show({ severity: 'success', summary: 'Ativada', detail: `Carteira "${item.nome}" agora está ativa.` });
    };

    const realizarLogout = () => {
        logout();
        navigate('/login');
    };

    const rodapeDialog = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setDialogVisible(false)} />
            <Button label={salvando ? 'Salvando...' : 'Salvar'} icon="pi pi-check" onClick={salvarCarteira} disabled={salvando} />
        </div>
    );

    return (
        <div className="prospera-layout">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Sidebar */}
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
                    <button className="prospera-nav-item" onClick={() => navigate('/app/categorias')}>
                        <i className="pi pi-tags"></i>
                        <span>Categorias</span>
                    </button>
                    <button className="prospera-nav-item active">
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

            {/* Conteúdo principal */}
            <main className="prospera-main">
                <header className="prospera-header">
                    <div>
                        <h1 className="prospera-title">Minhas Carteiras</h1>
                        <p className="prospera-subtitle">Gerencie suas carteiras financeiras</p>
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
                    <div className="carteiras-toolbar">
                        <p className="carteiras-info">
                            <i className="pi pi-info-circle"></i>
                            Você tem <strong>{carteiras.length}</strong> carteira(s)
                        </p>
                        <Button
                            label="Nova Carteira"
                            icon="pi pi-plus"
                            onClick={abrirNovaCarteira}
                            className="prospera-btn-primary"
                        />
                    </div>

                    {inicializando ? (
                        <div className="prospera-loading-inline">
                            <ProgressSpinner style={{ width: 40, height: 40 }} />
                        </div>
                    ) : carteiras.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#6b7280', padding: 32 }}>
                            Nenhuma carteira cadastrada. Crie a primeira!
                        </p>
                    ) : (
                        <div className="carteiras-grid">
                            {carteiras.map((item) => {
                                const isAtiva = carteiraAtiva?.id === item.id;
                                const isDono = item.meuPapel === 'DONO';

                                return (
                                    <div key={item.id} className={`carteira-card ${isAtiva ? 'ativa' : ''}`}>
                                        {isAtiva && <span className="carteira-badge">Ativa</span>}
                                        <div className="carteira-icone">
                                            <i className="pi pi-briefcase"></i>
                                        </div>
                                        <h3>{item.nome}</h3>
                                        <p className="carteira-descricao">{item.descricao || '(sem descrição)'}</p>
                                        <p className="carteira-dono">
                                            <strong>Dono:</strong> {item.donoNome}
                                        </p>
                                        <span className={`carteira-papel ${item.meuPapel?.toLowerCase()}`}>
                                            {item.meuPapel}
                                        </span>

                                        <div className="carteira-acoes">
                                            {!isAtiva && (
                                                <Button
                                                    label="Ativar"
                                                    icon="pi pi-check-circle"
                                                    onClick={() => ativarCarteira(item)}
                                                    size="small"
                                                />
                                            )}
                                            {isDono && (
                                                <>
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
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>

            <Dialog
                visible={dialogVisible}
                header={editando ? 'Editar Carteira' : 'Nova Carteira'}
                onHide={() => setDialogVisible(false)}
                style={{ width: '500px' }}
                footer={rodapeDialog}
                modal
            >
                <div className="transacao-form">
                    <div className="auth-field">
                        <label>Nome</label>
                        <InputText
                            value={carteira.nome}
                            onChange={(e) => setCarteira({ ...carteira, nome: e.target.value })}
                            placeholder="Ex: Casa, Empresa..."
                        />
                    </div>

                    <div className="auth-field">
                        <label>Descrição (opcional)</label>
                        <InputTextarea
                            value={carteira.descricao}
                            onChange={(e) => setCarteira({ ...carteira, descricao: e.target.value })}
                            rows={3}
                            placeholder="Uma breve descrição da carteira..."
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Carteiras;