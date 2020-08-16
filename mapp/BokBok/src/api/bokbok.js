import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const axiosInstance = axios.create({
    baseURL: 'http://a221bb8e6bed.ngrok.io/api'
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Add token to header before requesting
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default axiosInstance;
