import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true
});

api.interceptors.response.use(

    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 &&
            !originalRequest._retry) {
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