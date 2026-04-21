import axios from 'axios';
import keycloak from './keycloakService';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor — adds auto το token at every request
axiosInstance.interceptors.request.use(async (config) => {
    if (keycloak.isTokenExpired(30)) {
        await keycloak.updateToken(30);
    }
    config.headers.Authorization = `Bearer ${keycloak.token}`;
    return config;
});

export default axiosInstance;