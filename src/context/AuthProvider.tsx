import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext.ts';
import keycloak from '../services/keycloakService';
import axiosInstance from "@/services/axiosInstance.ts";
import {initializeUser} from "@/services/userService.ts";
import {getMe} from "@/api/userApi.ts";



export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
    const [hasRoommate, setHasRoommate] = useState<boolean | null>(null);
    const [roommateId, setRoommateId] = useState<number | null>(null);
    const [houseId, setHouseId] = useState<number | null>(null);
    const [avatarId, setAvatarId] = useState<string | null>(null);

    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const authenticated = await keycloak.init({
                    onLoad: 'check-sso',
                    silentCheckSsoRedirectUri:
                        window.location.origin + '/silent-check-sso.html',
                    pkceMethod: 'S256',
                });

                if (!authenticated) {
                    return;
                }

                // Send token directly to backend -> backend sets httpOnly cookies
                const code = new URLSearchParams(window.location.search).get('code');
                const codeVerifier = sessionStorage.getItem('kc-pkce-code-verifier');

                if (code && codeVerifier) {
                    try {
                        await axiosInstance.post('/api/auth/callback', {
                            code,
                            redirectUri: window.location.origin,
                            codeVerifier,
                        });
                    } catch {
                        // cookies may already exist from previous session
                    }
                } else if (keycloak.token) {
                    try {
                        await axiosInstance.post('/api/auth/token', {
                            accessToken: keycloak.token,
                            refreshToken: keycloak.refreshToken,
                            expiresIn: keycloak.tokenParsed?.exp ?? 300,
                            refreshExpiresIn: 1800,
                        });
                    } catch {
                        // ignore
                    }
                }

                // Lazy sync - creates User in DB on first login
                try {
                    await initializeUser();
                } catch {
                    // user may already exist
                }

                try {
                    const user = await getMe();
                    setAvatarId(user.avatarId);
                } catch {
                    // ignore
                }

                // Check if Roommate exists
                try {
                    const res = await axiosInstance.get('/api/roommate/me');
                    setHasRoommate(true);
                    setRoommateId(res.data.id);
                } catch {
                    setHasRoommate(false);
                }

                // Fetch houseId
                try {
                    const res = await axiosInstance.get('/api/house/my');
                    setHouseId(res.data.id);
                } catch {
                    setHouseId(null);
                }

                setUserEmail(keycloak.tokenParsed?.email);

                const roles =
                    (keycloak.tokenParsed as {
                        realm_access?: { roles?: string[] };
                    })?.realm_access?.roles ?? [];

                setIsSuperAdmin(roles.includes('SUPER_ADMIN'));
                setIsAdmin(
                    roles.includes('SUPER_ADMIN') ||
                    roles.includes('LIGHT_ADMIN')
                );

                setIsAuthenticated(true);
            } catch (error) {
                console.error('Auth initialization failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);
    const login = () => keycloak.login({
            redirectUri: window.location.origin + '/callback',
        });

    const logout = async () => {
        await axiosInstance.post('/api/auth/logout');
        keycloak.logout({ redirectUri: window.location.origin });
    };

    const refreshAuth = async () => {
        try {
            const res =await axiosInstance.get('/api/roommate/me');
            setHasRoommate(true);
            setRoommateId(res.data.id);
        } catch {
            setHasRoommate(false);
        }

        try {
            const res = await axiosInstance.get('/api/house/my');
            setHouseId(res.data.id);
        } catch {
            setHouseId(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated, isLoading, userEmail,
            hasRoommate, roommateId, houseId, avatarId,
            isAdmin, isSuperAdmin,
             login, logout, refreshAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};