import { createContext } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    userEmail: string | undefined;
    hasRoommate: boolean | null;
    roommateId: number | null;
    houseId: number | null;
    avatarId: string | null;
    login: () => void;
    logout: () => void;
    refreshAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export type { AuthContextType };