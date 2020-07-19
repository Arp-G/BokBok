import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://2c432ad9dcdc.ngrok.io/api'
});

export default axiosInstance;
