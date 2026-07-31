/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

// Workbox precaching (injected by VitePWA at build time)
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Skip waiting + claim clients
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Runtime caching: API and Keycloak requests bypass cache
registerRoute(
    /^https:\/\/api\.theroommies\.gr\/.*/,
    new NetworkOnly()
);
registerRoute(
    /^https:\/\/auth\.theroommies\.gr\/.*/,
    new NetworkOnly()
);
registerRoute(
    /\/api\/.*/,
    new NetworkOnly()
);

// Navigate fallback (SPA routing)
const navHandler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(navHandler, {
    denylist: [/^\/api/],
});
registerRoute(navigationRoute);


// WEB PUSH NOTIFICATIONS
/**
 * Fired when the push service delivers a message to this SW.
 * Handles both with and without payload:
 * - With payload: shows title + body from JSON
 * - Without payload: shows default "Νέα ειδοποίηση"
 */
self.addEventListener('push', (event: PushEvent) => {
    let title = 'Roommies';
    const options: NotificationOptions = {
        body: 'New notification',
        icon: '/roomies-192.png',
        badge: '/roomies-badge-96.png',
        tag: 'roommies-notification',
        data: { url: '/' },
    };

    if (event.data) {
        try {
            const data = event.data.json();
            title = data.title || title;
            options.body = data.body || options.body;
        } catch (e) {
            console.error('Push event parse error:', e);
        }
    }

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

/**
 * Fired when the user clicks/taps the system notification.
 * Opens the app or focuses an existing tab.
 */
self.addEventListener('notificationclick', (event: NotificationEvent) => {
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin)) {
                        return client.focus();
                    }
                }
                return self.clients.openWindow(urlToOpen);
            })
    );
});