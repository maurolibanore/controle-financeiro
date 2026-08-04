import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

const Dashboard = () =>{
    const {usuario, logout} = useAuth();
    const navigate = useNavigate();

    const realizarLogout = () => {
        logout();
        navigate('/login');
    };

    return(
        <div className="p-4">
            <div className="flex justify-content-between align-items-centes mb-4">
                <h1>Dashboard</h1>
                <div className="flex align-items-center gap-3">
                    <span>Olá, {usuario?.nome}</span>
                    <Button label="Sair" icon="pi pi-sign-out" onClick={realizarLogout} severity="secondary"></Button>
                </div>
            </div>
            <p>Bem vindo!</p>
        </div>
    );
};

export default Dashboard;