// WORKER CACHE
const CACHE_NAME = 'gemma-llm-model-v1'

// ASSET PATH
const MODEL_FILE = 'ganda-gemma-1b-instruct' 
const MODEL_ASSET_PATH = `./assets/${MODEL_FILE}.task`
const WASM_ASSET_PATH = './assets/mediapipe-wasm'

// FILES TO PRECACHE
const URLS = [
    '/',
    'index.html',
    'main.js',
    MODEL_ASSET_PATH,
    WASM_ASSET_PATH,
]

// 1. INSTALLATION
self.addEventListener('install', (event) => {
    // Log installation step
    console.log('Service Worker: Installing and pre-caching assets.')

    // Open the cache
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(URLS)))

    self.skipWaiting()
})

// 2. FETCH REQUESTS
self.addEventListener('fetch', (event) => {
    // Cache GET requests only
    if (event.request.method !== 'GET') return

    event.respondWith(caches.match(event.request).then((response) => {
        // Get from cache
        if (response) return response

        // Fetch from network
        return fetch(event.request)
    }))
})

// 3. CLEAN UP OLD CACHES
self.addEventListener('activate', (event) => {
    // Log cleanup
    console.log('Service worker: Cleaning up old caches')

    const CACHE_ALLOW_LIST = [CACHE_NAME]

    event.waitUntil(caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map(cacheName => {
            if (CACHE_ALLOW_LIST.indexOf(cacheName) === -1) return caches.delete(cacheName)
        }))
    }))
})