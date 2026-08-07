import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Message } from "primereact/message";
import { InputText } from "primereact/inputtext";
import AuthLayout from '../../components/AuthLayout';

const RecuperacaoSenha = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [enviado, setEnviado] = useState(false);

    const solicitarRecuperacao = async (event) =>{
        event.preventDefault();
        setCarregando(true);

        //simulacao
        await new Promise((resolve) => setTimeout(resolve,1000));

        setCarregando(false);
        setEnviado(true);
    };

    return (
        <AuthLayout titulo="Recuperar senha" subtitulo="Enviaremos as instruções para o seu e-mail">
            {enviado ? (
                <>
                    <Message severity="success" text="Se este e-mail estiver cadastrado, você receberá as instruções em breve." />
                    <div className="auth-link-center">
                        <button type="button" className="auth-link" onClick={() => navigate('/login')}>
                            Voltar ao Login
                        </button>
                    </div>
                </>
            ) : (
                <form onSubmit={solicitarRecuperacao}>
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

                    <button type="submit" disabled={carregando} className="auth-btn-primary">
                        {carregando ? 'Enviando...' : 'Enviar instruções'}
                    </button>

                    <div className="auth-link-center">
                        <button type="button" className="auth-link" onClick={() => navigate('/login')}>
                            Voltar ao Login
                        </button>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
};

export default RecuperacaoSenha;