const CACHE_NAME = 'prospera-v1';
const ASSETS_PARA_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_PARA_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((nomes) => {
            return Promise.all(
                nomes
                    .filter((nome) => nome !== CACHE_NAME)
                    .map((nome) => caches.delete(nome))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api/') ||
        event.request.url.includes(':8080') ||
        event.request.url.includes('/eventos/')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((respostaCache) => {
            if (respostaCache) {
                return respostaCache;
            }
            return fetch(event.request).then((respostaRede) => {
                if (!respostaRede || respostaRede.status !== 200) {
                    return respostaRede;
                }
                const respostaClonada = respostaRede.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, respostaClonada);
                });
                return respostaRede;
            }).catch(() => {
                return caches.match('/');
            });
        })
    );
});