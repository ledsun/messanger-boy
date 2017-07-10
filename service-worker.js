const VERSION = 1
const STATIC_CACHE_NAME = 'static_' + VERSION;
const ORIGIN = `${location.protocol}//${location.hostname}${(location.port ? ':' + location.port : '')}/messenger-boy`
const STATIC_FILES = [
  `${ORIGIN}/`,
  `${ORIGIN}/index.html`,
  `${ORIGIN}/audio/09_TOEIC2_tr09.mp3`,
  `${ORIGIN}/audio/14_TOEIC2_tr14.mp3`,
  `${ORIGIN}/audio/18_TOEIC2_tr18.mp3`,
  `${ORIGIN}/audio/19_TOEIC2_tr19.mp3`,
  `${ORIGIN}/audio/21_TOEIC2_tr21.mp3`,
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
  return cache.addAll(STATIC_FILES)
}

function saveResposeToCache(cache, response) {
  if (response.ok) {
    return cache.put(response.url, response)
  }

  return Promise.reject(`Invalid response.  URL: ${response.url} Status: ${response.status}`)
}

// Return cache if cached
self.addEventListener('fetch', (evt) => {
  event.respondWith(
    caches
    .open(STATIC_CACHE_NAME)
    .then((cache) => cache.match(evt.request)
      .then((response) => {
        if (response) {
          console.log(' Found response in cache:', response);

          return response;
        }
      })
      .catch(function(error) {

        // match() か fetch() で発生する例外をハンドルする。
        console.error('  Error in fetch handler:', error);

        throw error;
      })
    )
  )
})
self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  event.respondWith(

    //  'font' で始まる Cache オブジェクトを開く。
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
