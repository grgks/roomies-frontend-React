// API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// Keycloak
export const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL as string;
export const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM as string;
export const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string;

// Roles
export const ROLE_ADMIN = 'ADMIN';
export const ROLE_USER = 'USER';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;