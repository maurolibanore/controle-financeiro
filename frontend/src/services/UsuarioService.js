import BaseService from "./BaseService";

class UsuarioService extends BaseService {
    constructor() {
        super ('/usuario');
    }

    async buscarMeuPerfil() {
        const resposta = await this.api.get(`${this.endPoint}/me`);
        return resposta;
    }

    async atualizarMeuPerfil(dados) {
        const resposta = await this.api.put(`${this.endPoint}/me`, dados);
        return resposta;
    }

    async alterarMinhaSenha(dados) {
        const resposta = await this.api.put(`${this.endPoint}/me/senha`, dados);
        return resposta;
    }
}

export default UsuarioService;