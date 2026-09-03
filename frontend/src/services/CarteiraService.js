import BaseService from "./BaseService";

class CarteiraService extends BaseService {
    constructor() {
        super ('/carteira');
    }

    async atualizarCarteira(id, dados) {
        const resposta = await this.api.put(`${this.endPoint}/${id}`, dados);
        return resposta;
    }

    async deletarCarteira(id) {
        const resposta = await this.api.delete(`${this.endPoint}/${id}`);
        return resposta;
    }
}

export default CarteiraService;