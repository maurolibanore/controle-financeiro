import { createContext, useContext, useState, useEffect } from 'react';
import CarteiraService from '../services/CarteiraService';
import { useAuth } from './AuthContext';

const CarteiraContext = createContext(null);
const carteiraService = new CarteiraService();

export function CarteiraProvider({ children }) {
    const { usuario } = useAuth();
    const [carteiraAtiva, setCarteiraAtiva] = useState(
        () => JSON.parse(localStorage.getItem('carteira-ativa') || 'null')
    );
    const [carteiras, setCarteiras] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // Quando o usuário muda (login/logout), reseta o estado
    useEffect(() => {
        if (!usuario) {
            setCarteiraAtiva(null);
            setCarteiras([]);
        } else {
            const salva = JSON.parse(localStorage.getItem('carteira-ativa') || 'null');
            setCarteiraAtiva(salva);
        }
    }, [usuario]);

    const carregarCarteiras = async () => {
        setCarregando(true);
        try {
            const resposta = await carteiraService.buscarTodos();
            setCarteiras(resposta.data);

            // Se não tem carteira ativa mas tem carteiras, define a primeira
            if (!carteiraAtiva && resposta.data.length > 0) {
                selecionarCarteira(resposta.data[0]);
            }
        } catch (erro) {
            console.error('Erro ao carregar carteiras:', erro);
        } finally {
            setCarregando(false);
        }
    };

    const selecionarCarteira = (carteira) => {
        localStorage.setItem('carteira-ativa', JSON.stringify(carteira));
        setCarteiraAtiva(carteira);
    };

    const limparCarteira = () => {
        localStorage.removeItem('carteira-ativa');
        setCarteiraAtiva(null);
    };

    return (
        <CarteiraContext.Provider value={{
            carteiraAtiva,
            carteiras,
            carregando,
            carregarCarteiras,
            selecionarCarteira,
            limparCarteira
        }}>
            {children}
        </CarteiraContext.Provider>
    );
}

export function useCarteira() {
    return useContext(CarteiraContext);
}