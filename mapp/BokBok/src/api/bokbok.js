import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://06690f33e02a.ngrok.io/api'
});

export default axiosInstance;
