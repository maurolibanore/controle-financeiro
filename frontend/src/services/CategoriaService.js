import BaseService from "./BaseService";

class CategoriaService extends BaseService {
    constructor() {
        super('/categoria');
    }

    async atualizarCategoria(id, dados) {
        const resposta = await this.api.put(`${this.endPoint}/${id}`, dados);
        return resposta;
    }

    async deletarCategoria(id) {
        const resposta = await this.api.delete(`${this.endPoint}/${id}`);
        return resposta;
    }
}

export default CategoriaService;