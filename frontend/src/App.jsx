import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importando a sua tela de cadastro
import Cadastro from './pages/Cadastro/Cadastro'; 

// Quando você criar o arquivo Login.jsx, é só descomentar as linhas abaixo:
// import Login from './pages/Login/Login';

function App() {
  return (
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
  );
}

export default App;