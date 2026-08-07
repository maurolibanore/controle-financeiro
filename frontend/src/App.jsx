import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RotaProtegida from './components/RotaProtegida';
import Cadastro from './pages/Cadastro/Cadastro'; 
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import RecuperacaoSenha from './pages/RecuperacaoSenha/RecuperacaoSenha';
import RedefinirSenha from './pages/RedefinirSenha/RedefinirSenha';
import AlteracaoSenha from './pages/AlteracaoSenha/AlteracaoSenha';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redireciona a página inicial direto para o cadastro para você testar */}
          <Route path="/" element={<Navigate to="/cadastro" />} />
          
          {/* Rota da tela de cadastro */}
          <Route path="/cadastro" element={<Cadastro />} />
          
          {/* Rota da tela de login (descomente quando criar) */}
          <Route path="/login" element={<Login />} /> 

          {/* Rota da tela de dashboard*/}
          <Route path="/app/dashboard" element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          } />

          {/* Rota da tela de recSenha*/}
          <Route path="/recuperar-senha" element={<RecuperacaoSenha />} /> 

          {/* Rota da tela de redSenha*/}
          <Route path="/redefinir-senha/:token" element={<RedefinirSenha />} />

          {/* Rota da tela de alterarSenha*/}
          <Route path="/app/perfil/senha" element={
            <RotaProtegida>
              <AlteracaoSenha />
            </RotaProtegida>
          } />

        </Routes>
      </BrowserRouter>      
    </AuthProvider>

  );
}

export default App;