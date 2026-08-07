import React from 'react';
import './AuthLayout.css';

const AuthLayout = ({ children, titulo, subtitulo }) => {
    return (
        <div className="auth-container">
            
            <div className="auth-branding">
                <div className="auth-branding-content">
                    <div className="auth-logo">
                        <span className="auth-logo-icon">P</span>
                        <span className="auth-logo-text">Prospera</span>
                    </div>

                    <h1 className="auth-slogan">
                        Prospere suas finanças com controle e clareza
                    </h1>

                    <p className="auth-descricao">
                        Gerencie receitas, despesas e compartilhe sua carteira com quem importa.
                    </p>

                    <div className="auth-features">
                        <div className="auth-feature">
                            <i className="pi pi-chart-line"></i>
                            <span>Acompanhe sua evolução financeira</span>
                        </div>
                        <div className="auth-feature">
                            <i className="pi pi-users"></i>
                            <span>Compartilhe com familiares e amigos</span>
                        </div>
                        <div className="auth-feature">
                            <i className="pi pi-shield"></i>
                            <span>Seus dados estão sempre protegidos</span>
                        </div>
                    </div>
                </div>

                <div className="auth-branding-footer">
                    <p>© 2026 Prospera. Todos os direitos reservados.</p>
                </div>
            </div>

            {/*form */}
            <div className="auth-form-side">
                <div className="auth-form-wrapper">
                    <div className="auth-form-header">
                        <h2>{titulo}</h2>
                        {subtitulo && <p>{subtitulo}</p>}
                    </div>
                    {children}
                </div>
            </div>

        </div>
    );
};

export default AuthLayout;