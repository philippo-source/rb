//manuell
//OFFLINE
const cacheName = 'cache-v1';
const cacheName2 = 'cache-v2';
const resourcesToPrecache = [
    '/',
    'assets/logo3.png',
    'css/reset.css',
    'css/styles.css'
];

self.addEventListener('install', event => {
  //self.skipWaiting();
    console.log("Service worker install event!");
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            return cache.addAll(resourcesToPrecache);
        })
    );
    
});

self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        return cachedResponse || fetch(event.request);
    })
    );
});

// self.addEventListener('fetch', (event) => {
//     event.respondWith(
//       caches.match(event.request).then((resp) => {
//         return resp || fetch(event.request).then((response) => {
//           return caches.open(cacheName2).then((cache) => {
//             cache.put(event.request, response.clone());
//             console.log(response);
//             console.log(cache);
//             return response;
//           });
//         });
//       })
//     );
//   });

//self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('activate', (event) => {
    var cacheKeeplist = [cacheName2];
  
    event.waitUntil(
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (cacheKeeplist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        }));
      })
    );
  });

self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});