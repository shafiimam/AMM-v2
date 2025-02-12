// Open the IndexedDB and retrieve data
function getAssetsFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open('myAssetsDB', 1);

    dbRequest.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction('assets', 'readonly');
      const store = transaction.objectStore('assets');
      const getRequest = store.get('assetList');

      getRequest.onsuccess = (event) => {
        if (event.target.result) {
          resolve(event.target.result.urls); // Return the URLs array
        } else {
          resolve([]); // No data found
        }
      };

      getRequest.onerror = (error) => reject(error);
    };

    dbRequest.onerror = (error) => reject(error);
  });
}

// Service Worker Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    getAssetsFromIndexedDB()
      .then((urls) => {
        if (urls.length > 0) {
          return caches.open('my-cache-v1').then((cache) => {
            console.log('Caching assets during install:', urls);
            return cache.addAll(urls);
          });
        }
      })
      .catch((error) => {
        console.error('Failed to access IndexedDB or cache assets:', error);
      })
  );
});

// Fetch Event to Serve Cached Assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      console.log('Serving from cache:', event.request.url);
      return response || fetch(event.request);
    })
  );
});
