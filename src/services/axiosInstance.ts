import axios from 'axios';


// withCredentials: true — browser automatically sends httpOnly cookies with every request
// No token handling needed — backend reads JWT from cookie via CookieBearerTokenResolver
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
});

// Custom header για CSRF protection - triggers CORS preflight in cross-site requests,
// so plain HTML form submissions from malicious sites cannot forge state-changing requests.
axiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Response interceptor - handles token refresh on 401
// Flow: request -> 401 -> refresh token -> retry original request
// If refresh fails -> logout (cookies cleared)
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(null);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // // Log timeout errors
        // if (error.code === 'ECONNABORTED') {
        //     console.error('Request timed out:', error.config?.url);
        // }

        // Avoid infinite loop - don't retry refresh endpoint itself
        if (error.response?.status === 401 && !originalRequest._retry &&
            !originalRequest.url?.includes('/api/auth/')) {

            if (isRefreshing) {
                // Queue requests while refresh is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => axiosInstance(originalRequest))
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Refresh token - backend sets new access_token cookie
                await axiosInstance.post('/api/auth/refresh');
                processQueue(null);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh failed - logout user
                processQueue(refreshError);
                await axiosInstance.post('/api/auth/logout');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;