const VERSION = 1
const STATIC_CACHE_NAME = 'static_' + VERSION;

// Cache alll static files
self.addEventListener('install', (evt) => {
  console.log('install ');
  evt.waitUntil(
    caches
    .open(STATIC_CACHE_NAME)
    .then((cache) => cache.addAll(['/messenger-boy/', '/messenger-boy/index.html']))
  )
})
