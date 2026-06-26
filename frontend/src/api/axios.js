import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true
});

api.interceptors.response.use(

    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        const authRoutes = [
            "/users/login",
            "/users/register",
            "/users/refresh-token",
        ];

        const isAuthRoute = authRoutes.includes(originalRequest.url);

        if (error.response?.status === 401 &&
            !originalRequest._retry && !isAuthRoute) {
            try {
                originalRequest._retry = true;
                await api.post("/users/refresh-token");
                return api(originalRequest);
            } 
            catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);

    }

);

export default api;