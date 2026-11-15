import BaseService from "./BaseService";

class InsightService extends BaseService {
    constructor() {
        super('/carteira');
    }

    async gerarInsights(carteiraId, mes, ano) {
        const resposta = await this.api.get(
            `${this.endPoint}/${carteiraId}/insights`,
            { params: { mes, ano } }
        );
        return resposta;
    }
}

export default InsightService;