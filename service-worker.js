const VERSION = 1
const STATIC_CACHE_NAME = 'static_' + VERSION;
const ORIGIN = `${location.protocol}//${location.hostname}${(location.port ? ':' + location.port : '')}`
const STATIC_FILES = [
  `${ORIGIN}/`,
  `${ORIGIN}/index.html`,
  `${ORIGIN}/audio/09_TOEIC2_tr09.mp3`
]
const STATIC_FILE_URLS = new Set(STATIC_FILES)

// Cache alll static files
self.addEventListener('install', (evt) => {
  console.log('install ');
  evt.waitUntil(
    caches
    .open(STATIC_CACHE_NAME)
    .then(cacheAllFiles)
  )
})

function cacheAllFiles(cache) {
  return Promise.all(STATIC_FILES
    .map((url) => fetch(new Request(url))
      .then((res) => saveResposeToCache(cache, res))
    ))
}

function saveResposeToCache(cache, response) {
  if (response.ok) {
    return cache.put(response.url, response)
  }

  return Promise.reject(`Invalid response.  URL: ${response.url} Status: ${response.status}`)
}

// Return cache if cached
self.addEventListener('fetch', (evt) => {
  const matched = caches.match(evt.request, {
    cacheName: STATIC_CACHE_NAME
  })

  if (!matched) {
    return
  }

  evt.respondWith(matched)
})

// Clean old caches
// https://developer.mozilla.org/ja/docs/Web/API/ServiceWorker_API/Using_Service_Workers
// > onactivateの基本的な使用法は、以前のバージョンのService Workerスクリプトで使用したリソースのクリーンアップです。
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys()
    .then((cachedURLs) => Promise.all(cachedURLs
      .filter((url) => url != STATIC_CACHE_NAME)
      .map((already_unused) => caches.delete(already_unused)))))
})
