import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card'; // Ajuste o caminho conforme sua biblioteca
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import UsuarioService from '../../services/UsuarioService';
import './Cadastro.css';

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
        <div className="flex justify-content-center align-items-center min-h-screen">
            <Card title="Criar Conta" className="w-full md:w-4 shadow-5">
                <form onSubmit={realizarCadastro} className="flex flex-column gap-3">
                    {erro && <Message severity="error" text={erro} />}
                    {sucesso && <Message severity="success" text={sucesso} />}

                    <div className="flex flex-column gap-2">
                        <label htmlFor="nome">Nome</label>
                        <InputText id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="email">E-mail</label>
                        <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="senha">Senha</label>
                        <Password id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} toggleMask required feedback={false} />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="confirmaSenha">Confirmar Senha</label>
                        <Password id="confirmaSenha" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} toggleMask required feedback={false} />
                    </div>

                    <Button label={carregando ? 'Cadastrando...' : 'Cadastrar'} type="submit" disabled={carregando} className="mt-2" />
                    
                    <div className="text-center mt-2">
                        <Button label="Já tem conta? Faça Login" link onClick={() => navigate('/login')} type="button" />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Cadastro;