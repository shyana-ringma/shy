"use strict"; //forces all errors, clean code
//files for cace offline use
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/client.js",
  "/style.css",
  "/images/favicon.ico",
  "/manifest.json",
  "/install.js"
];

/*provide cache name wich allows to ceate dif vesions of service worker
 *easily update files
 */
const CACHE_NAME = "static-cache-v6";
const DATA_CACHE_NAME = "data-cache-v6";

/*install event to pages tat caches offline resuces*/

self.addEventListener("install", evt => {
  console.log("[ServiceWorker] Install");

  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[ServiceWorker] Pre-Catching offine page");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", evt => {
  console.log("[ServiceWorker] Activate");
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// part 3 step 8 STEP 8
self.addEventListener("fetch", evt => {
  console.log("[ServiceWorker] Fetch", evt.request.url);
  if (evt.request.url.includes("/api/")) {
    console.log("[Service Woker] Fetch (data)", evt.request.url);
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }
            return response;
          })
          .catch(err => {
            return cache.match(evt.request);
          });
      })
    );
    return;
  }
  evt.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
});

/*
self.addEventListener('fetch', (evt) => {
   console.log('[ServiceWorker] Fetch', evt.request.url);
if (evt.request.mode !== 'navigate') {
  // Not a page navigation, bail.
  return;
}
evt.respondWith(
  //get request from 
    fetch(evt.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
              .then((cache) => {
                return cache.match('offline.html');
              });
        })
);
});
*/
