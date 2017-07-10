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
  // return cache.addAll(STATIC_FILES)
  return cache.addAll(['messenger-boy/', 'messenger-boy/index.html'])
}
