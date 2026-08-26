import BaseService from "./BaseService";

class AutenticacaoService extends BaseService {
    constructor() {
        super('/autenticacao');
    }

    async login(dados) {
        const resposta = await this.api.post(`${this.endPoint}/login`, dados);
        return resposta;
    }

    async esqueciSenha(dados) {
        const resposta = await this.api.post(`${this.endPoint}/esqueci-senha`, dados);
        return resposta;
    }

    async redefinirSenha(dados) {
        const resposta = await this.api.post(`${this.endPoint}/redefinir-senha`, dados);
        return resposta;
    }
}

export default AutenticacaoService;