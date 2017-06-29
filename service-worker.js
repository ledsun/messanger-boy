const VERSION = 1
const STATIC_CACHE_NAME = 'static_' + VERSION;
const ORIGIN = `${location.protocol}//${location.hostname}${(location.port ? ':' + location.port : '')}`
const STATIC_FILES = [
  `${ORIGIN}/`,
  `${ORIGIN}/audio/09_TOEIC2_tr09.mp3`
]
const STATIC_FILE_URL_HASH = new Set()
STATIC_FILES.forEach((x) => STATIC_FILE_URL_HASH.add(x))

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(STATIC_CACHE_NAME)
    .then((cache) => {
      return Promise.all(STATIC_FILES.map((url) => {
        return fetch(new Request(url))
          .then((response) => {
            if (response.ok) {
              return cache.put(response.url, response);
            }

            return Promise.reject(`Invalid response.  URL: ${response.url} Status: ${response.status}`)
          })
      }))
    }))
})

self.addEventListener('fetch', (evt) => {
  if (!STATIC_FILE_URL_HASH.has(evt.request.url)) {
    return
  }

  evt.respondWith(caches.match(evt.request, {
    cacheName: STATIC_CACHE_NAME
  }))
})

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys()
    .then((keys) => {
      const deleteCachePromises = keys
        .filter((cacheName) => cacheName != STATIC_CACHE_NAME)
        .map((cacheName) => caches.delete(cacheName))

      return Promise.all(deleteCachePromises);
    }))
})
