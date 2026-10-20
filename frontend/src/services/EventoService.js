class EventoService {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
        this.eventSource = null;
    }

    conectar(carteiraId, handlers) {
        this.desconectar();

        const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
        const token = usuario?.token;

        if (!token || !carteiraId) return;

        const url = `${this.baseURL}/eventos/carteira/${carteiraId}?token=${token}`;
        this.eventSource = new EventSource(url);

        if (handlers.onConectado) {
            this.eventSource.addEventListener('conectado', (e) => handlers.onConectado(e.data));
        }
        if (handlers.onNovaTransacao) {
            this.eventSource.addEventListener('nova-transacao', (e) => {
                handlers.onNovaTransacao(JSON.parse(e.data));
            });
        }
        if (handlers.onTransacaoAtualizada) {
            this.eventSource.addEventListener('transacao-atualizada', (e) => {
                handlers.onTransacaoAtualizada(JSON.parse(e.data));
            });
        }
        if (handlers.onTransacaoDeletada) {
            this.eventSource.addEventListener('transacao-deletada', (e) => {
                handlers.onTransacaoDeletada(JSON.parse(e.data));
            });
        }

        this.eventSource.onerror = (erro) => {
            console.error('Erro na conexão SSE:', erro);
        };
    }

    desconectar() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }
}

export default EventoService;