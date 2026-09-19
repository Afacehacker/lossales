import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 
             (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? '/api' 
                : 'https://lossales.onrender.com/api'),

});

API.interceptors.request.use((req) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
    }
    return req;
});

export default API;
