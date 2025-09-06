```javascript
// service-worker.js

const CACHE_NAME = 'mh-qadri-cache-v2'; // वर्जन बदला गया है ताकि नया अपडेट लागू हो
const URLS_TO_CACHE = [
  '/',
  'index.html',
  'manifest.json',
  'icon-192x192.png',
  'icon-512x512.png'
];

// इंस्टॉल इवेंट: ऐप शेल को कैश करें
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// फ़ेच इवेंट: नेटवर्क पहले, फिर कैश
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // अगर नेटवर्क फेल हो जाए, तो कैश से जवाब दें
      return caches.match(event.request);
    })
  );
});


self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```