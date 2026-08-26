import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import AuthLayout from '../../components/AuthLayout';
import AutenticacaoService from '../../services/AutenticacaoService';

const autenticacaoService = new AutenticacaoService();

const RedefinirSenha = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    if (!token) {
        return (
            <AuthLayout titulo="Link inválido" subtitulo="O token de recuperação não foi encontrado">
                <Message severity="error" text="Token inválido ou ausente." />
                <div className="auth-link-center">
                    <button type="button" className="auth-link" onClick={() => navigate('/login')}>
                        Voltar ao Login
                    </button>
                </div>
            </AuthLayout>
        );
    }

    const redefinirSenha = async (event) => {
        event.preventDefault();
        setErro('');

        if (novaSenha !== confirmaSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        if (novaSenha.length < 6) {
            setErro('A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        setCarregando(true);

        try {
            await autenticacaoService.redefinirSenha({ token, novaSenha });
            setSucesso(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (erroRedefinir) {
            const mensagem = erroRedefinir?.response?.data?.mensagem || 'Erro ao redefinir senha.';
            setErro(mensagem);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <AuthLayout titulo="Redefinir senha" subtitulo="Escolha uma nova senha segura para sua conta">
            {sucesso ? (
                <Message severity="success" text="Senha redefinida com sucesso! Redirecionando..." />
            ) : (
                <form onSubmit={redefinirSenha}>
                    {erro && <Message severity="error" text={erro} />}

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
                        <label htmlFor="confirmaSenha">Confirmar senha</label>
                        <Password 
                            id="confirmaSenha" 
                            value={confirmaSenha} 
                            onChange={(e) => setConfirmaSenha(e.target.value)} 
                            placeholder="Digite a senha novamente"
                            toggleMask 
                            feedback={false} 
                            required 
                        />
                    </div>

                    <button type="submit" disabled={carregando} className="auth-btn-primary">
                        {carregando ? 'Salvando...' : 'Redefinir senha'}
                    </button>
                </form>
            )}
        </AuthLayout>
    );
};

export default RedefinirSenha;