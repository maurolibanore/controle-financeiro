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
import { useCarteira } from '../../context/CarteiraContext';
import CarteiraMembroService from '../../services/CarteiraMembroService';
import './Compartilhamento.css';

const membroService = new CarteiraMembroService();

const Compartilhamento = () => {
    const navigate = useNavigate();
    const { usuario, logout } = useAuth();
    const { carteiras, carregarCarteiras } = useCarteira();
    const toast = useRef(null);

    const [carteiraSelecionada, setCarteiraSelecionada] = useState(null);
    const [membros, setMembros] = useState([]);
    const [carregando, setCarregando] = useState(false);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [novoMembro, setNovoMembro] = useState({ email: '', papel: 'VISUALIZADOR' });
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (carteiras.length === 0) {
            carregarCarteiras();
        }
    }, []);

    useEffect(() => {
        if (carteiraSelecionada) {
            carregarMembros();
        }
    }, [carteiraSelecionada]);

    const carregarMembros = async () => {
        setCarregando(true);
        try {
            const resposta = await membroService.listarMembros(carteiraSelecionada.id);
            setMembros(resposta.data);
        } catch (erro) {
            const mensagem = erro?.response?.data?.mensagem || 'Erro ao carregar membros.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: mensagem });
        } finally {
            setCarregando(false);
        }
    };

    const abrirAdicionar = () => {
        setNovoMembro({ email: '', papel: 'VISUALIZADOR' });
        setDialogVisible(true);
    };

    const adicionarMembro = async () => {
        if (!novoMembro.email) {
            toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Informe o e-mail.' });
            return;
        }

        setSalvando(true);
        try {
            await membroService.adicionarMembro(carteiraSelecionada.id, novoMembro);
            toast.current.show({ severity: 'success', summary: 'Adicionado', detail: 'Membro adicionado.' });
            setDialogVisible(false);
            carregarMembros();
        } catch (erro) {
            const mensagem = erro?.response?.data?.mensagem || 'Erro ao adicionar membro.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: mensagem });
        } finally {
            setSalvando(false);
        }
    };

    const alterarPapel = async (membro, novoPapel) => {
        try {
            await membroService.alterarPapel(carteiraSelecionada.id, membro.usuarioId, { papel: novoPapel });
            toast.current.show({ severity: 'success', summary: 'Atualizado', detail: 'Papel alterado.' });
            carregarMembros();
        } catch (erro) {
            const mensagem = erro?.response?.data?.mensagem || 'Erro ao alterar papel.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: mensagem });
        }
    };

    const confirmarRemover = (membro) => {
        confirmDialog({
            message: `Remover "${membro.usuarioNome}" da carteira?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => removerMembro(membro)
        });
    };

    const removerMembro = async (membro) => {
        try {
            await membroService.removerMembro(carteiraSelecionada.id, membro.usuarioId);
            toast.current.show({ severity: 'success', summary: 'Removido', detail: 'Membro removido.' });
            carregarMembros();
        } catch (erro) {
            const mensagem = erro?.response?.data?.mensagem || 'Erro ao remover.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: mensagem });
        }
    };

    const realizarLogout = () => {
        logout();
        navigate('/login');
    };

    const opcoesCarteiras = carteiras.map(c => ({ label: c.nome, value: c }));

    const opcoesPapel = [
        { label: 'Visualizador', value: 'VISUALIZADOR' },
        { label: 'Editor', value: 'EDITOR' }
    ];

    const souDono = carteiraSelecionada?.meuPapel === 'DONO';

    const rodapeDialog = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setDialogVisible(false)} />
            <Button label={salvando ? 'Adicionando...' : 'Adicionar'} icon="pi pi-check" onClick={adicionarMembro} disabled={salvando} />
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
                    <button className="prospera-nav-item" onClick={() => navigate('/app/categorias')}>
                        <i className="pi pi-tags"></i>
                        <span>Categorias</span>
                    </button>
                    <button className="prospera-nav-item" onClick={() => navigate('/app/carteiras')}>
                        <i className="pi pi-briefcase"></i>
                        <span>Carteiras</span>
                    </button>
                    <button className="prospera-nav-item active">
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
                        <h1 className="prospera-title">Compartilhamento</h1>
                        <p className="prospera-subtitle">Gerencie quem tem acesso às suas carteiras</p>
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
                    <div className="compart-toolbar">
                        <div>
                            <label className="compart-label">Selecione a carteira</label>
                            <Dropdown
                                value={carteiraSelecionada}
                                options={opcoesCarteiras}
                                onChange={(e) => setCarteiraSelecionada(e.value)}
                                placeholder="Escolha uma carteira..."
                                className="w-20rem"
                            />
                        </div>
                        {carteiraSelecionada && souDono && (
                            <Button
                                label="Adicionar Membro"
                                icon="pi pi-user-plus"
                                onClick={abrirAdicionar}
                                className="prospera-btn-primary"
                            />
                        )}
                    </div>

                    {!carteiraSelecionada ? (
                        <p style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>
                            Selecione uma carteira para ver os membros.
                        </p>
                    ) : carregando ? (
                        <div className="prospera-loading-inline">
                            <ProgressSpinner style={{ width: 40, height: 40 }} />
                        </div>
                    ) : (
                        <>
                            {!souDono && (
                                <div className="compart-aviso">
                                    <i className="pi pi-info-circle"></i>
                                    Apenas o dono da carteira pode adicionar, alterar ou remover membros.
                                </div>
                            )}

                            <div className="membros-lista">
                                {membros.map((membro) => (
                                    <div key={membro.id} className="membro-card">
                                        <div className="membro-avatar">
                                            {membro.usuarioNome.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="membro-info">
                                            <h3>{membro.usuarioNome}</h3>
                                            <p>{membro.usuarioEmail}</p>
                                            <span className={`membro-papel ${membro.papel.toLowerCase()}`}>
                                                {membro.papel}
                                            </span>
                                        </div>
                                        {souDono && membro.papel !== 'DONO' && (
                                            <div className="membro-acoes">
                                                <Dropdown
                                                    value={membro.papel}
                                                    options={opcoesPapel}
                                                    onChange={(e) => alterarPapel(membro, e.value)}
                                                    className="w-10rem"
                                                />
                                                <Button
                                                    icon="pi pi-trash"
                                                    className="p-button-rounded p-button-text p-button-danger"
                                                    onClick={() => confirmarRemover(membro)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </main>

            <Dialog
                visible={dialogVisible}
                header="Adicionar Membro"
                onHide={() => setDialogVisible(false)}
                style={{ width: '500px' }}
                footer={rodapeDialog}
                modal
            >
                <div className="transacao-form">
                    <div className="auth-field">
                        <label>E-mail do usuário</label>
                        <InputText
                            type="email"
                            value={novoMembro.email}
                            onChange={(e) => setNovoMembro({ ...novoMembro, email: e.target.value })}
                            placeholder="usuario@email.com"
                        />
                        <small style={{ color: '#6b7280', marginTop: 4 }}>
                            O usuário precisa já ter uma conta no Prospera
                        </small>
                    </div>

                    <div className="auth-field">
                        <label>Papel</label>
                        <Dropdown
                            value={novoMembro.papel}
                            options={opcoesPapel}
                            onChange={(e) => setNovoMembro({ ...novoMembro, papel: e.value })}
                        />
                        <small style={{ color: '#6b7280', marginTop: 4 }}>
                            <strong>Editor:</strong> pode criar/editar transações<br />
                            <strong>Visualizador:</strong> só pode visualizar
                        </small>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Compartilhamento;