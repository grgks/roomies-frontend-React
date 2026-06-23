import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from '@/utils/constants';


//singleton pattern.module-level variable/only one connection for the app
let client: Client | null = null;


//callback for every time notification comes
export const connectStomp = (
    onNotification: (notification: unknown) => void
) => {
    client = new Client({

        //creates sockJs connection.browser sends automatically cookiee on handshake and spring identify user
        webSocketFactory: () => {
        const socket = new SockJS(`${API_BASE_URL}/ws`);
        return socket;
        },

        reconnectDelay: 5000,

        //when connect subscribe to /usr/queue/notifications. private channel for specific user.
        // Spring auto connect correct user with keycloak
        onConnect: () => {
            console.info('[STOMP] Connected');
            client?.subscribe('/user/queue/notifications', (message) => {
                const notification = JSON.parse(message.body);
                onNotification(notification);  //from NotificationContext
            });
        },


        onDisconnect: () => {
            console.info('[STOMP] Disconnected');
        },

        onStompError: (frame) => {
            console.warn('[STOMP] Error', frame);
        },
    });

    client.activate();
};

export const disconnectStomp = () => {
    client?.deactivate();
    client = null;
};