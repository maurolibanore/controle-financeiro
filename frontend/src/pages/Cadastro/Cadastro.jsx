import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import UsuarioService from '../../services/UsuarioService';
import AuthLayout from '../../components/AuthLayout';

const usuarioService = new UsuarioService();

const Cadastro = () => {
    const navigate = useNavigate();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);

    const realizarCadastro = async (event) => {
    // Evita o recarregamento da página
    event.preventDefault(); 
    
    // Limpa mensagens anteriores
    setErro('');
    setSucesso('');

    // Validação básica de senha
    if (senha !== confirmaSenha) {
        setErro('As senhas não coincidem!');
        return;
    }

    setCarregando(true);
    
    // Monta o objeto que o axios vai enviar no body da requisição
    const dados = { nome, email, senha };

    try {
        await usuarioService.inserir(dados);
        setSucesso('Cadastro realizado com sucesso.');

        // Limpa os campos após o sucesso
        setNome("");
        setEmail("");
        setSenha("");
        setConfirmaSenha("");
        
        // edirecionar para o login após 2 segundos:
        // setTimeout(() => navigate('/login'), 2000);

    } catch (erroCadastro) {
        const mensagem = erroCadastro?.response?.data?.mensagem || 'Não foi possível realizar o cadastro.';
        setErro(mensagem);
        console.error("Erro detalhado:", erroCadastro);
    } finally {
        setCarregando(false);
    }
};

    return (
        <AuthLayout titulo="Criar sua conta" subtitulo="Comece a organizar suas finanças hoje">
            <form onSubmit={realizarCadastro}>
                {erro && <Message severity="error" text={erro} />}
                {sucesso && <Message severity="success" text={sucesso} />}

                <div className="auth-field">
                    <label htmlFor="nome">Nome</label>
                    <InputText id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>

                <div className="auth-field">
                    <label htmlFor="email">E-mail</label>
                    <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="auth-field">
                    <label htmlFor="senha">Senha</label>
                    <Password id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} toggleMask required feedback />
                </div>

                <div className="auth-field">
                    <label htmlFor="confirmaSenha">Confirmar Senha</label>
                    <Password id="confirmaSenha" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} toggleMask required feedback={false} />
                </div>

                <button type="submit" disabled={carregando} className="auth-btn-primary">
                    {carregando ? 'Cadastrando...' : 'Cadastrar'}
                </button>

                <div className="auth-link-center">
                    Já tem conta?{' '}
                    <button type="button" className="auth-link" onClick={() => navigate('/login')}>
                        Faça Login
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Cadastro;