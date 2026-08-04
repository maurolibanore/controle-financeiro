import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { InputText } from "primereact/inputtext";

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

    return(
        <div className="flex justify-content-center align-items-center min-h-screen">
            <Card title="Recuperar Senha" className="w-full md:w-4 shadow-5">
                {enviado ? (
                    <div className="flex flex-column gap-3">
                        <Message severity="success" text="Se este e-mail estiver cadastrado, você receberá as instruções em breve." />
                        <Button label="Voltar ao Login" link onClick={() => navigate('/login')} />
                    </div>
                ) : (
                    <form onSubmit={solicitarRecuperacao} className="flex flex-column gap-3">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="email">E-mail</label>
                            <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <Button label={carregando ? 'Enviando...' : 'Enviar instruções'} type="submit" disabled={carregando} />

                        <div className="text-center">
                            <Button label="Voltar ao Login" link onClick={() => navigate('/login')} type="button" />
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default RecuperacaoSenha;