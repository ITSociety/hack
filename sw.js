//This is the service worker with the Cache-first network

const CACHE = 'hack-2'
const precacheFiles = [
  '/',
  '/index.html',
  '/public/fb.png',
  '/public/twit.png',
  '/public/temp.css',
  '/public/white-logo.png'
]

//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', (evt) => {
  console.log('[PWA] The service worker is being installed.')
  evt.waitUntil(precache().then(() => self.skipWaiting()))
})

//allow sw to control of current page
self.addEventListener('activate', () => {
  console.log('[PWA] Claiming clients for current page')
  return self.clients.claim()
})

self.addEventListener('fetch', (evt) => {
  console.log('[PWA] The service worker is serving the asset.'+ evt.request.url)
  evt.respondWith(fromCache(evt.request))
  evt.waitUntil(update(evt.request))
})


const precache = () => caches.open(CACHE).then((cache) => cache.addAll(precacheFiles))

//we pull files from the cache first thing so we can show them fast
const fromCache = (request) => 
  caches.open(CACHE).then(
    (cache) => cache.match(request).then(
      (matching) => matching || fetch(request)
    )
  )

//this is where we call the server to get the newest version of the 
//file to use the next time we show view
const update = (request) => 
  caches.open(CACHE).then(
    (cache) => fetch(request).then(
      (response) => cache.put(request, response)
    )
  )
