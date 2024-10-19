// axiosInstance.js
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL; // Your API URL
const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
