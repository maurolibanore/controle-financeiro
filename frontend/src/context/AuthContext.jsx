import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }){
    const [usuario, setUsuario] = useState(() => JSON.parse(localStorage.getItem('usuario')|| 'null'));

    function login(dadosUsuario){
        localStorage.removeItem('carteira-ativa');
        localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
        setUsuario(dadosUsuario);
    }

    function logout(){
        localStorage.removeItem('usuario');
        localStorage.removeItem('app-token');
        localStorage.removeItem('carteira-ativa');
        setUsuario(null);
    }

    return(
        <AuthContext.Provider value={{usuario,login,logout}}>{children}</AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}