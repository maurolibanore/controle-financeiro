import BaseService from "./BaseService";

class CarteiraMembroService extends BaseService {
    constructor() {
        super('/carteira');
    }

    async listarMembros(carteiraId) {
        const resposta = await this.api.get(`${this.endPoint}/${carteiraId}/membros`);
        return resposta;
    }

    async adicionarMembro(carteiraId, dados) {
        const resposta = await this.api.post(`${this.endPoint}/${carteiraId}/membros`, dados);
        return resposta;
    }

    async alterarPapel(carteiraId, usuarioId, dados) {
        const resposta = await this.api.patch(`${this.endPoint}/${carteiraId}/membros/${usuarioId}`, dados);
        return resposta;
    }

    async removerMembro(carteiraId, usuarioId) {
        const resposta = await this.api.delete(`${this.endPoint}/${carteiraId}/membros/${usuarioId}`);
        return resposta;
    }
}

export default CarteiraMembroService;