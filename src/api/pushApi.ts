import axiosInstance from '../services/axiosInstance';

/**
 * Fetches the VAPID public key from our backend.
 * The browser needs this to establish a trusted push subscription.
 */
export const getVapidKey = async (): Promise<string> => {
    const { data } = await axiosInstance.get<string>('/api/push/vapid-key');
    return data;
};

/**
 * Sends the browser's push subscription to our backend for storage.
 * Called after the user grants notification permission.
 */
export const subscribePush = async (subscription: PushSubscription): Promise<void> => {
    const key = subscription.getKey('p256dh');
    const auth = subscription.getKey('auth');

    await axiosInstance.post('/api/push/subscribe', {
        endpoint: subscription.endpoint,
        p256dh: key ? btoa(String.fromCharCode(...Array.from(new Uint8Array(key)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : '',
        auth: auth ? btoa(String.fromCharCode(...Array.from(new Uint8Array(auth)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : '',
    });
};