import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://c4ec6cf33532.ngrok.io/api'
});

export default axiosInstance;
