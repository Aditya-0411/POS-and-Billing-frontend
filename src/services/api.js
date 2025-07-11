import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/auth/';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access')}`,
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;
