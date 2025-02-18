import axios from "axios";

const instance = axios.create();

instance.defaults.withCredentials = true;
instance.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
instance.defaults.headers.common["Accept"] = "application/json";

const updateCsrfToken = async () => {
    const response = await axios.get("/sanctum/csrf-cookie");
    const token = document.querySelector('meta[name="csrf-token"]');
    if (token) {
        token.setAttribute(
            "content",
            response.data.csrf_token || token.content
        );
        return token.content;
    }
    return null;
};

const token = document.querySelector('meta[name="csrf-token"]');
if (token) {
    instance.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
}

instance.interceptors.request.use(
    async (config) => {
        const token = document.querySelector('meta[name="csrf-token"]');
        if (token) {
            config.headers["X-CSRF-TOKEN"] = token.content;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    async (response) => {
        await updateCsrfToken();
        return response;
    },
    async (error) => {
        if (error.response?.status === 419) {
            const newToken = await updateCsrfToken();
            if (newToken) {
                const config = error.config;
                config.headers["X-CSRF-TOKEN"] = newToken;
                return instance.request(config);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
