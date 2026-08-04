import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

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
            <div className="flex justify-content-center align-items-center min-h-screen">
                <Card title="Link Inválido" className="w-full md:w-4 shadow-5">
                    <Message severity="error" text="Token inválido ou ausente." />
                    <Button label="Voltar ao Login" link onClick={() => navigate('/login')} className="mt-3" />
                </Card>
            </div>
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
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCarregando(false);
        setSucesso(true);

        setTimeout(() => navigate('/login'), 2000);
    };

    return (
        <div className="flex justify-content-center align-items-center min-h-screen">
            <Card title="Redefinir Senha" className="w-full md:w-4 shadow-5">
                {sucesso ? (
                    <Message severity="success" text="Senha redefinida com sucesso! Redirecionando..." />
                ) : (
                    <form onSubmit={redefinirSenha} className="flex flex-column gap-3">
                        {erro && <Message severity="error" text={erro} />}

                        <div className="flex flex-column gap-2">
                            <label htmlFor="novaSenha">Nova Senha</label>
                            <Password id="novaSenha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} toggleMask required feedback={false} />
                        </div>

                        <div className="flex flex-column gap-2">
                            <label htmlFor="confirmaSenha">Confirmar Senha</label>
                            <Password id="confirmaSenha" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} toggleMask required feedback={false} />
                        </div>

                        <Button label={carregando ? 'Salvando...' : 'Redefinir Senha'} type="submit" disabled={carregando} />
                    </form>
                )}
            </Card>
        </div>
    );
};

export default RedefinirSenha;