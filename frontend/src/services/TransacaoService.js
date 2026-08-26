import BaseService from "./BaseService";

class TransacaoService extends BaseService{
    constructor() {
        super ('/carteira');
    }

    async buscarTransacoes(carteiraId, params ={}){
        const resposta = await this.api.get(`${this.endPoint}/${carteiraId}/transacao`,{params});
        return resposta;
    }

    async buscarResumo(carteiraId, dataInicio, dataFim){
        const params = {};
        if(dataInicio) params.dataInicio = dataInicio;
        if(dataFim) params.dataFim = dataFim;
        const resposta = await this.api.get(`${this.endPoint}/${carteiraId}/transacao/resumo`, {params});
        return resposta;
    }

    async inserirTransacao(carteiraId, dados) {
        const resposta = await this.api.post(`${this.endPoint}/${carteiraId}/transacao`, dados);
        return resposta;
    }

    async atualizarTransacao(carteiraId, id, dados) {
        const resposta = await this.api.put(`${this.endPoint}/${carteiraId}/transacao/${id}`, dados);
        return resposta;
    }

    async deletarTransacao(carteiraId, id) {
        const resposta = await this.api.delete(`${this.endPoint}/${carteiraId}/transacao/${id}`);
        return resposta;
    }
}

export default TransacaoService;