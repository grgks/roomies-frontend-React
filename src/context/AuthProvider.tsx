import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext.ts';
import keycloak from '../services/keycloakService';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string | undefined>(undefined);
    const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

    useEffect(() => {
        keycloak
            .init({
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
            })
            .then((authenticated) => {
                setIsAuthenticated(authenticated);
                setToken(keycloak.token);
                setUserEmail(keycloak.tokenParsed?.email);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    }, []);

    const login = () => keycloak.login();
    const logout = () => keycloak.logout({ redirectUri: window.location.origin });

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, token, userEmail, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};