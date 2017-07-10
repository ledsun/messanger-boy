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

self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    caches.open(STATIC_CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        if (response) {
          console.log(' Found response in cache:', response);

          return response;
        }
      }).catch(function(error) {

        // match() か fetch() で発生する例外をハンドルする。
        console.error('  Error in fetch handler:', error);

        throw error;
      });
    })
  );
});
