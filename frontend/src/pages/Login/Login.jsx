import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { useAuth } from '../../context/AuthContext';
import AutenticacaoService from '../../services/AutenticacaoService';
import UsuarioService from '../../services/UsuarioService';
import AuthLayout from '../../components/AuthLayout';

const autenticacaoService = new AutenticacaoService();
const usuarioService = new UsuarioService();

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const realizarLogin = async (event) => {
        event.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            // valida credenciais e dispara cod 2FA por email
            await autenticacaoService.login({ email, senha });

            // redireciona para a tela de verf passando o email via state
            navigate('/verificar-codigo', { state: { email, senha } });
        } catch (erroLogin) {
            const mensagem = erroLogin?.response?.data?.mensagem || 'E-mail ou senha inválidos.';
            setErro(mensagem);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <AuthLayout titulo="Bem-vindo de volta" subtitulo="Entre para acessar sua conta">
            <form onSubmit={realizarLogin}>
                {erro && <Message severity="error" text={erro} />}

                <div className="auth-field">
                    <label htmlFor="email">E-mail</label>
                    <InputText 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="seu@email.com"
                        required 
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="senha">Senha</label>
                    <Password 
                        id="senha" 
                        value={senha} 
                        onChange={(e) => setSenha(e.target.value)} 
                        placeholder="Digite sua senha"
                        toggleMask 
                        feedback={false} 
                        required 
                    />
                </div>

                <button type="submit" disabled={carregando} className="auth-btn-primary">
                    {carregando ? 'Entrando...' : 'Entrar'}
                </button>

                <div className="auth-links">
                    <button type="button" className="auth-link" onClick={() => navigate('/recuperar-senha')}>
                        Esqueceu a senha?
                    </button>
                    <button type="button" className="auth-link" onClick={() => navigate('/cadastro')}>
                        Criar conta
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;