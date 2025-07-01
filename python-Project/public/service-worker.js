// Service Worker for TimezoneBuddy
// This ensures notifications work properly

const CACHE_NAME = "timezoneBuddy-v1";
const urlsToCache = ["/", "/index.html", "/favicon.ico"];

// Install event - cache assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching Files");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");

  // Delete old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Fetching");

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Push event - handle push notifications
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push Received");

  const data = event.data.json();

  const options = {
    body: data.body || "Notification from TimezoneBuddy",
    icon: data.icon || "/favicon.ico",
    badge: data.badge || "/favicon.ico",
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "TimezoneBuddy Notification",
      options
    )
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification Click");

  event.notification.close();

  // This looks to see if the current is already open
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      })
  );
});
