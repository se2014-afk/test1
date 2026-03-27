const CACHE_NAME = 'no-cache-v1';

// При активации удаляем все старые кэши, если они были
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) => {
            return Promise.all(names.map(name => caches.delete(name)));
        })
    );
});

// Перехват каждого запроса
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).then((response) => {
            // Сразу после получения ответа от сервера — удаляем его из всех кэшей браузера
            caches.open(CACHE_NAME).then((cache) => {
                cache.delete(event.request);
            });
            return response;
        }).catch(() => fetch(event.request))
    );
});
