/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

//Workbox precaching (same as before, injected by VitePWA at build time)
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Skip waiting + claim clients (same as before)
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
    /^https:\/\/keycloak-prod-production-7079\.up\.railway\.app\/.*/,
    new NetworkOnly()
);
registerRoute(
    /\/api\/.*/,
    new NetworkOnly()
);

//Navigate fallback (SPA routing)
const navHandler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(navHandler, {
    denylist: [/^\/api/],
});
registerRoute(navigationRoute);


// WEB PUSH NOTIFICATIONS

/**
 * Fired when the push service delivers a message to this SW.
 * The backend sends a JSON payload: { title: "...", body: "..." }
 * We parse it and show a system-level notification via the OS.
 */
self.addEventListener('push', (event: PushEvent) => {

    if (!event.data) return;

    try {
        const data = event.data.json();
        const title = data.title || 'Roommies';
        const options: NotificationOptions = {
            body: data.body || '',
            icon: '/roomies-192.png',
            badge: '/roomies-192.png',
            tag: 'roommies-notification',
            data: { url: '/' },
        };

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    } catch (e) {
        console.error('Push event parse error:', e);
    }
});
/**
 * Fired when the user clicks/taps the system notification.
 * Opens the app or focuses an existing tab.
 */
self.addEventListener('push', (event: PushEvent) => {
    console.log('PUSH RECEIVED');
    console.log('Has data:', !!event.data);

    if (!event.data) {
        console.log('No data in push');
        return;
    }

    try {
        const rawText = event.data.text();
        console.log('Raw push data:', rawText);
        const data = JSON.parse(rawText);
        console.log('Parsed:', JSON.stringify(data));

        const title = data.title || 'Roommies';
        const options: NotificationOptions = {
            body: data.body || '',
            icon: '/roomies-192.png',
            badge: '/roomies-192.png',
            tag: 'roommies-notification',
            data: { url: '/' },
        };

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    } catch (e) {
        console.error('Push event parse error:', e);
    }
});