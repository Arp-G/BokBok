import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://7e03b3d62a9b.ngrok.io/api'
});

export default axiosInstance;
