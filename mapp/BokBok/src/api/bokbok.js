import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://25bb147bdfcb.ngrok.io/api'
});

export default axiosInstance;
