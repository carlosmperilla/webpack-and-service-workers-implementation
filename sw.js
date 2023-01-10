// Debe permanecer en el directorio raíz para poder activar el evento 'fetch'
// Si no no puede trackear los archivos.

const CACHE_NAME = 'VIDEOGAME-STORE_CACHE-v1';
importScripts('./filesList.js');

self.addEventListener('install', () => {
    
    // Guardar archivos iniciales.
    caches.open(CACHE_NAME).then((cache) => {
        cache.addAll(getFilesList());
    })
})

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            let promises = cacheNames.map(cacheName => {
                if (CACHE_NAME !== cacheName) return caches.delete(cacheName);
            });

            return Promise.all(promises);
        })
    );
})

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then( (response) => {
            return searchInCacheOrMakeRequest(e.request);
        }).catch((err) => {
            if (e.request.mode == 'navigate')
                return caches.match(e.request);
        })
    );
})

async function searchInCacheOrMakeRequest(request) {
    const cachePromise = caches.open(CACHE_NAME);
    const matchPromise = cachePromise.then((cache) => {
        return cache.match(request);
    })

    return Promise.all([cachePromise, matchPromise])
        .then(([cache, cacheResponse]) => {
            const fetchPromise = fetch(request).then((fetchResponse) => {
                cache.put(request, fetchResponse.clone());
                return fetchResponse;
            })
            return cacheResponse || fetchPromise;
        })
}