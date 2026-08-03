import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RotaProtegida from './components/RotaProtegida';
import Cadastro from './pages/Cadastro/Cadastro'; 

// import Login from './pages/Login/Login';

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
          {/* <Route path="/login" element={<Login />} /> */}
        </Routes>
      </BrowserRouter>      
    </AuthProvider>

  );
}

export default App;