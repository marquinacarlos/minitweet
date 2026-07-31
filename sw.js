const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';

const urlsToCache = [
	'/index.html',
	'/manifest.json',
	'/minitweet.svg',
	'/favicon.svg',
	'/styles/tailwindCSS.css',
	...[48, 72, 96, 128, 144, 152, 192, 256, 384, 512].map(size => `/ico_minitweet_${size}x${size}.png`),
];

self.addEventListener('install', (e) => {
	self.skipWaiting();
	e.waitUntil(
		caches.open(CACHE_STATIC_NAME)
			.then((cache) => {
				return cache.addAll(urlsToCache);
			})
	)
	// console.log('Cacheado los recursos estaticos');
});

self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(cacheNames.map((cacheName) => {
				if (cacheName !== CACHE_STATIC_NAME && cacheName !== CACHE_DYNAMIC_NAME) {
					// console.log('Borrando cache antiguo', cacheName);
					return caches.delete(cacheName);
				}
				// console.log('No se borra cache', cacheName);
			}));
		})
	)
});

self.addEventListener('fetch', (e) => {
	if (e.request.method !== 'GET') return;

	e.respondWith(
		fetch(e.request).then((networkResponse) => {
			return caches.open(CACHE_DYNAMIC_NAME)
				.then((cache) => {
					cache.put(e.request, networkResponse.clone());
					return networkResponse;
				})
		}).catch(() => {
			return caches.match(e.request);
		})
	);
});
