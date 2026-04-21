import { createContext } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | undefined;
    userEmail: string | undefined;
    login: () => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export type { AuthContextType };