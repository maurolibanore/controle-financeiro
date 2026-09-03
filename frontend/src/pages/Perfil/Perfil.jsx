import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from '../../context/AuthContext';
import UsuarioService from '../../services/UsuarioService';
import './Perfil.css';

const usuarioService = new UsuarioService();

const Perfil = () => {
    const navigate = useNavigate();
    const { usuario, logout, login } = useAuth();
    const toast = useRef(null);

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [dados, setDados] = useState({ nome: '', email: '', criadoEm: '' });

    useEffect(() => {
        carregarPerfil();
    }, []);

    const carregarPerfil = async () => {
        try {
            const resposta = await usuarioService.buscarMeuPerfil();
            setDados(resposta.data);
        } catch (erro) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar perfil.' });
        } finally {
            setCarregando(false);
        }
    };

    const salvarPerfil = async () => {
        if (!dados.nome || dados.nome.trim().length < 2) {
            toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Nome deve ter no mínimo 2 caracteres.' });
            return;
        }

        setSalvando(true);
        try {
            const resposta = await usuarioService.atualizarMeuPerfil({ nome: dados.nome });
            
            // Atualiza o AuthContext com o novo nome
            login({ ...usuario, nome: resposta.data.nome });
            
            toast.current.show({ severity: 'success', summary: 'Atualizado', detail: 'Perfil atualizado com sucesso!' });
        } catch (erro) {
            const mensagem = erro?.response?.data?.mensagem || 'Erro ao salvar.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: mensagem });
        } finally {
            setSalvando(false);
        }
    };

    const realizarLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="prospera-layout">
            <Toast ref={toast} />

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
                    <button className="prospera-nav-item" onClick={() => navigate('/app/carteiras')}>
                        <i className="pi pi-briefcase"></i>
                        <span>Carteiras</span>
                    </button>
                    <button className="prospera-nav-item" onClick={() => navigate('/app/compartilhamento')}>
                        <i className="pi pi-users"></i>
                        <span>Compartilhamento</span>
                    </button>
                    <button className="prospera-nav-item active">
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
                        <h1 className="prospera-title">Meu Perfil</h1>
                        <p className="prospera-subtitle">Gerencie suas informações pessoais</p>
                    </div>
                    <div className="prospera-user">
                        <div className="prospera-avatar">{usuario?.nome?.charAt(0).toUpperCase()}</div>
                        <div>
                            <p className="prospera-user-name">{usuario?.nome}</p>
                            <p className="prospera-user-email">{usuario?.email}</p>
                        </div>
                    </div>
                </header>

                {carregando ? (
                    <div className="prospera-loading-inline">
                        <ProgressSpinner style={{ width: 40, height: 40 }} />
                    </div>
                ) : (
                    <div className="perfil-grid">

                        <section className="prospera-panel perfil-info">
                            <div className="prospera-panel-header">
                                <h2>Informações da conta</h2>
                                <p>Seus dados pessoais</p>
                            </div>

                            <div className="perfil-avatar-grande">
                                {dados.nome?.charAt(0).toUpperCase()}
                            </div>
                            <p className="perfil-info-nome">{dados.nome}</p>
                            <p className="perfil-info-email">{dados.email}</p>

                            <div className="perfil-metadata">
                                <div>
                                    <i className="pi pi-calendar"></i>
                                    <span>Membro desde {new Date(dados.criadoEm).toLocaleDateString('pt-BR')}</span>
                                </div>
                            </div>
                        </section>

                        <section className="prospera-panel">
                            <div className="prospera-panel-header">
                                <h2>Editar dados</h2>
                                <p>Atualize suas informações</p>
                            </div>

                            <div className="perfil-form">
                                <div className="auth-field">
                                    <label htmlFor="nome">Nome</label>
                                    <InputText
                                        id="nome"
                                        value={dados.nome}
                                        onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                                    />
                                </div>

                                <div className="auth-field">
                                    <label htmlFor="email">E-mail</label>
                                    <InputText
                                        id="email"
                                        value={dados.email}
                                        disabled
                                    />
                                    <small className="perfil-hint">O e-mail não pode ser alterado</small>
                                </div>

                                <Button
                                    label={salvando ? 'Salvando...' : 'Salvar alterações'}
                                    onClick={salvarPerfil}
                                    disabled={salvando}
                                    className="prospera-btn-primary"
                                />
                            </div>
                        </section>

                        <section className="prospera-panel perfil-seguranca">
                            <div className="prospera-panel-header">
                                <h2>Segurança</h2>
                                <p>Configurações de segurança da sua conta</p>
                            </div>

                            <div className="perfil-seguranca-item">
                                <div>
                                    <p className="perfil-seguranca-titulo">Senha</p>
                                    <p className="perfil-seguranca-descricao">Altere sua senha para manter a conta segura</p>
                                </div>
                                <Button
                                    label="Alterar senha"
                                    icon="pi pi-key"
                                    onClick={() => navigate('/app/perfil/senha')}
                                    outlined
                                />
                            </div>
                        </section>

                    </div>
                )}
            </main>
        </div>
    );
};

export default Perfil;