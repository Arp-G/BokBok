import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://7f6ba56644af.ngrok.io/api'
});

export default axiosInstance;
