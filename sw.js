// При установке — немедленно берем управление
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// При активации — удаляем ВСЕ кэши этого домена в браузере
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map(key => caches.delete(key)));
        }).then(() => self.clients.claim())
    );
});

// Перехват: просто идем в сеть, ничего не сохраняя
self.addEventListener('fetch', (event) => {
    // Не обрабатываем запросы к расширениям браузера
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        fetch(event.request, { cache: 'no-store' }) // Прямой приказ сети: не брать из кэша
    );
});
