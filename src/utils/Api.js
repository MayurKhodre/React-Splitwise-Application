import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1', // Adjust base URL as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add authToken to headers for each request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor to handle expired authTokens and refreshing them
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If the error is due to token expiration and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get refresh token from localStorage
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    // No refresh token, log the user out
                    throw new Error('No refresh token available');
                }

                // Request a new authToken using the refreshToken
                const { data } = await axios.post('http://localhost:8000/api/v1/users/refresh-token', { refreshToken });
                
                // Store the new authToken in localStorage
                localStorage.setItem('authToken', data.data.accessToken);
                
                // Retry the original request with the new token
                api.defaults.headers.Authorization = `Bearer ${data.data.accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                
                return api(originalRequest); // Retry the request
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                localStorage.clear(); // Clear tokens and log out
                window.location.href = '/login'; // Redirect to login page
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
