// TrackMate Service Worker
const CACHE_NAME = 'trackmate-v1.0.0';
const OFFLINE_URL = 'offline.html';

// Assets to cache
const ASSETS_TO_CACHE = [
    '/trackmate/',
    '/trackmate/login.html',
    '/trackmate/signup.html',
    '/trackmate/forgot-password.html',
    '/trackmate/dashboard.html',
    '/trackmate/assets/css/auth-style.css',
    '/trackmate/assets/js/auth.js',
    '/trackmate/assets/icons/icon-192.png',
    '/trackmate/assets/icons/icon-512.png',
    '/trackmate/manifest.json'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Installation failed:', error);
            })
    );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch Strategy: Network First, Fall Back to Cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip API requests from caching
    if (request.url.includes('/api/')) {
        return;
    }
    
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Clone the response
                const responseClone = response.clone();
                
                // Cache the new response
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(request, responseClone);
                    });
                
                return response;
            })
            .catch(() => {
                // Network request failed, try cache
                return caches.match(request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        
                        // If no cache, return offline page for navigation requests
                        if (request.destination === 'document') {
                            return caches.match(OFFLINE_URL);
                        }
                        
                        // Return a basic error response for other requests
                        return new Response('Network error', {
                            status: 408,
                            statusText: 'Network error'
                        });
                    });
            })
    );
});

// Background Sync
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync:', event.tag);
    
    if (event.tag === 'sync-activities') {
        event.waitUntil(syncActivities());
    }
});

// Push Notifications
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New notification from TrackMate',
        icon: '/trackmate/assets/icons/icon-192.png',
        badge: '/trackmate/assets/icons/icon-72.png',
        vibrate: [200, 100, 200],
        tag: 'trackmate-notification',
        requireInteraction: false,
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'view',
                title: 'View',
                icon: '/trackmate/assets/icons/icon-96.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/trackmate/assets/icons/icon-96.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('TrackMate', options)
    );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/trackmate/dashboard.html')
        );
    }
});

// Message Handler
self.addEventListener('message', (event) => {
    console.log('[Service Worker] Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        return caches.delete(cacheName);
                    })
                );
            })
        );
    }
});

// Helper function for syncing activities
async function syncActivities() {
    try {
        // Get pending activities from IndexedDB or localStorage
        // Send them to the server
        console.log('[Service Worker] Syncing activities...');
        
        // Implementation depends on your data storage strategy
        return Promise.resolve();
    } catch (error) {
        console.error('[Service Worker] Sync failed:', error);
        return Promise.reject(error);
    }
}

// Periodic Background Sync (if supported)
self.addEventListener('periodicsync', (event) => {
    console.log('[Service Worker] Periodic sync:', event.tag);
    
    if (event.tag === 'update-activities') {
        event.waitUntil(syncActivities());
    }
});
