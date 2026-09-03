import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { useAuth } from '../../context/AuthContext';
import UsuarioService from '../../services/UsuarioService';
import './AlteracaoSenha.css';

const usuarioService = new UsuarioService();

const AlteracaoSenha = () => {
    const navigate = useNavigate();
    const { usuario, logout } = useAuth();
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);

    const realizarLogout = () => {
        logout();
        navigate('/login');
    };

    const alterarSenha = async (event) => {
        event.preventDefault();
        setErro('');
        setSucesso('');

        if (novaSenha.length < 6) {
            setErro('A nova senha deve ter no mínimo 6 caracteres.');
            return;
        }

        if (novaSenha !== confirmaSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        setCarregando(true);

        try {
            await usuarioService.alterarMinhaSenha({ senhaAtual, novaSenha });
            setSucesso('Senha alterada com sucesso!');
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmaSenha('');
        } catch (erroAlterar) {
            const mensagem = erroAlterar?.response?.data?.mensagem || 'Erro ao alterar senha.';
            setErro(mensagem);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="prospera-layout">

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
                    <button className="prospera-nav-item">
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
                        <h1 className="prospera-title">Alterar Senha</h1>
                        <p className="prospera-subtitle">Mantenha sua conta segura com uma nova senha</p>
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

                <div className="alteracao-senha-container">
                    <div className="alteracao-senha-card">
                        <form onSubmit={alterarSenha}>
                            {erro && <Message severity="error" text={erro} />}
                            {sucesso && <Message severity="success" text={sucesso} />}

                            <div className="auth-field">
                                <label htmlFor="senhaAtual">Senha atual</label>
                                <Password 
                                    id="senhaAtual" 
                                    value={senhaAtual} 
                                    onChange={(e) => setSenhaAtual(e.target.value)} 
                                    placeholder="Digite sua senha atual"
                                    toggleMask 
                                    feedback={false} 
                                    required 
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="novaSenha">Nova senha</label>
                                <Password 
                                    id="novaSenha" 
                                    value={novaSenha} 
                                    onChange={(e) => setNovaSenha(e.target.value)} 
                                    placeholder="Mínimo 6 caracteres"
                                    toggleMask 
                                    feedback 
                                    required 
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="confirmaSenha">Confirmar nova senha</label>
                                <Password 
                                    id="confirmaSenha" 
                                    value={confirmaSenha} 
                                    onChange={(e) => setConfirmaSenha(e.target.value)} 
                                    placeholder="Digite a nova senha novamente"
                                    toggleMask 
                                    feedback={false} 
                                    required 
                                />
                            </div>

                            <button type="submit" disabled={carregando} className="auth-btn-primary">
                                {carregando ? 'Salvando...' : 'Alterar senha'}
                            </button>
                        </form>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default AlteracaoSenha;