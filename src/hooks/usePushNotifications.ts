import { useCallback } from 'react';
import { getVapidKey, subscribePush } from '../api/pushApi';


export const usePushNotifications = () => {

    /**
     * subscription flow:
     * 1. Check if browser supports push
     * 2. Request notification permission (OS-level prompt)
     * 3. Get VAPID public key from backend
     * 4. Subscribe browser to push service (Google FCM / Mozilla / Apple)
     * 5. Send subscription details to our backend for storage
     */
    const requestPushPermission = useCallback(async (): Promise<boolean> => {
        try {
            // Check browser support
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                console.warn('Push notifications not supported');
                return false;
            }

            // Request permission - shows OS-level "Allow / Block" prompt
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.info('Push notification permission denied');
                return false;
            }

            // Get the active service worker registration
            const registration = await navigator.serviceWorker.ready;

            // Get VAPID key from backend
            const vapidKey = await getVapidKey();

            // Subscribe to push service

            let subscription;
            try {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: vapidKey,
                });
            } catch (err) {
                // VAPID key changed. Unsubscribe old, resubscribe with new key
                if (err instanceof DOMException && err.name === 'InvalidStateError') {
                    const existing = await registration.pushManager.getSubscription();
                    if (existing) await existing.unsubscribe();
                    subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: vapidKey,
                    });
                } else {
                    throw err;
                }
            }

            // Send subscription to our backend
            await subscribePush(subscription);
            console.info('Push subscription successful');
            return true;

        } catch (error) {
            console.error('Push subscription failed:', error);
            return false;
        }
    }, []);

    return { requestPushPermission };
};