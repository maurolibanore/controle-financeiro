import BaseService from "./BaseService";

class UsuarioService extends BaseService {
    constructor() {
        super ('/usuario');
    }
// temporario para ver se esta direcionando certo
    async login(dados) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (dados.email === 'teste@teste.com' && dados.senha === '123456') {
                    resolve({
                        data: {
                            id: 1,
                            nome: 'Usuário Teste',
                            email: dados.email,
                            token: 'token-mock-123'
                        }
                    });
                } else {
                    reject({
                        response: {
                            data: {
                                mensagem: 'E-mail ou senha inválidos.'
                            }
                        }
                    });
                }
            }, 1000);
        });
    }
}

export default UsuarioService;