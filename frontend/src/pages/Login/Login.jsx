import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { useAuth } from '../../context/AuthContext';
import UsuarioService from '../../services/UsuarioService';

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
            const resposta = await usuarioService.login({ email, senha });
            login(resposta.data);
            navigate('/app/dashboard');
        } catch (erroLogin) {
            const mensagem = erroLogin?.response?.data?.mensagem || 'E-mail ou senha inválidos.';
            setErro(mensagem);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="flex justify-content-center align-items-center min-h-screen">
            <Card title="Entrar" className="w-full md:w-4 shadow-5">
                <form onSubmit={realizarLogin} className="flex flex-column gap-3">
                    {erro && <Message severity="error" text={erro} />}

                    <div className="flex flex-column gap-2">
                        <label htmlFor="email">E-mail</label>
                        <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="senha">Senha</label>
                        <Password id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} toggleMask required feedback={false} />
                    </div>

                    <Button label={carregando ? 'Entrando...' : 'Entrar'} type="submit" disabled={carregando} className="mt-2" />

                    <div className="text-center mt-2">
                        <Button label="Esqueceu a senha?" link onClick={() => navigate('/recuperar-senha')} type="button" />
                        <Button label="Criar conta" link onClick={() => navigate('/cadastro')} type="button" />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Login;