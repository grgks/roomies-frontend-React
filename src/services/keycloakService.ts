import Keycloak from 'keycloak-js';

// Created one unique instance of keycloak for all application
// Singleton pattern — we do not want multiple instances
const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export default keycloak;