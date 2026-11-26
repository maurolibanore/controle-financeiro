import BaseService from "./BaseService";

class RelatorioService extends BaseService {
    constructor() {
        super('/carteira');
    }

    async baixarPdfTransacoes(carteiraId, params = {}) {
        const resposta = await this.api.get(
            `${this.endPoint}/${carteiraId}/relatorio/transacoes/pdf`,
            {
                params,
                responseType: 'blob'
            }
        );
        return resposta;
    }
}

export default RelatorioService;