import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { useAuth } from '../../context/AuthContext';
import AutenticacaoService from '../../services/AutenticacaoService';
import UsuarioService from '../../services/UsuarioService';
import AuthLayout from '../../components/AuthLayout';

const autenticacaoService = new AutenticacaoService();
const usuarioService = new UsuarioService();

const VerificarCodigo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const email = location.state?.email || '';
    const senha = location.state?.senha || '';

    const [codigo, setCodigo] = useState('');
    const [erro, setErro] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [reenviando, setReenviando] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    const verificar = async (event) => {
        event.preventDefault();
        setErro('');
        setMensagem('');

        if (codigo.length !== 6) {
            setErro('O código deve ter 6 dígitos.');
            return;
        }

        setCarregando(true);
        try {
            const respostaVerificacao = await autenticacaoService.verificarCodigo({ email, codigo });
            const token = respostaVerificacao.data.token;

            localStorage.setItem('usuario', JSON.stringify({ token }));

            const respostaPerfil = await usuarioService.buscarMeuPerfil();
            const dadosUsuario = { ...respostaPerfil.data, token };

            login(dadosUsuario);
            navigate('/app/dashboard');
        } catch (err) {
            const mensagemErro = err?.response?.data?.mensagem || 'Código inválido ou expirado.';
            setErro(mensagemErro);
            localStorage.removeItem('usuario');
        } finally {
            setCarregando(false);
        }
    };

    const reenviarCodigo = async () => {
        setErro('');
        setMensagem('');
        setReenviando(true);

        try {
            await autenticacaoService.login({ email, senha });
            setMensagem('Novo código enviado para seu e-mail.');
            setCodigo('');
        } catch (err) {
            setErro('Erro ao reenviar código. Tente fazer login novamente.');
        } finally {
            setReenviando(false);
        }
    };

    return (
        <AuthLayout 
            titulo="Verificação em duas etapas" 
            subtitulo={`Enviamos um código de 6 dígitos para ${email}`}
        >
            <form onSubmit={verificar}>
                {erro && <Message severity="error" text={erro} />}
                {mensagem && <Message severity="success" text={mensagem} />}

                <div className="auth-field">
                    <label htmlFor="codigo">Código de verificação</label>
                    <InputText 
                        id="codigo" 
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={codigo} 
                        onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))} 
                        placeholder="000000"
                        autoFocus
                        required 
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={carregando || codigo.length !== 6} 
                    className="auth-btn-primary"
                >
                    {carregando ? 'Verificando...' : 'Confirmar'}
                </button>

                <div className="auth-links">
                    <button 
                        type="button" 
                        className="auth-link" 
                        onClick={reenviarCodigo}
                        disabled={reenviando}
                    >
                        {reenviando ? 'Reenviando...' : 'Reenviar código'}
                    </button>
                    <button 
                        type="button" 
                        className="auth-link" 
                        onClick={() => navigate('/login')}
                    >
                        Voltar ao login
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default VerificarCodigo;