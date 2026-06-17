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

export const NAV_LINKS = [
    { to: "/expenses",    label: "Expenses" },
    { to: "/roommates",   label: "Roommates" },
    { to: "/messages",    label: "Messages" },
    { to: "/tasks",       label: "Tasks" },
    { to: "/ratings",     label: "Ratings" },
    { to: "/invitations", label: "Invitations" },
    { to: "/house",       label: "Houses" },
] as const;

// Avatars
export const AVATARS = [
    { id: 'avatar_1',  url: 'https://api.dicebear.com/7.x/personas/svg?seed=Felix' },
    { id: 'avatar_2',  url: 'https://api.dicebear.com/7.x/personas/svg?seed=Mia' },
    { id: 'avatar_3',  url: 'https://api.dicebear.com/7.x/personas/svg?seed=Alex' },
    { id: 'avatar_4',  url: 'https://api.dicebear.com/7.x/personas/svg?seed=Jordan' },
    { id: 'avatar_5',  url: 'https://api.dicebear.com/7.x/personas/svg?seed=Sam' },
    { id: 'avatar_6',  url: 'https://api.dicebear.com/7.x/personas/svg?seed=Taylor' },
    { id: 'avatar_7',  url: 'https://api.dicebear.com/7.x/personas/svg?seed=Morgan' },
    { id: 'avatar_8',  url: 'https://api.dicebear.com/7.x/personas/svg?seed=Casey' },
    { id: 'avatar_9',  url: 'https://api.dicebear.com/7.x/personas/svg?seed=Riley' },
    { id: 'avatar_10', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Drew' },
] as const;