import axios from 'axios';

const api_client = axios.create({
  baseURL: 'http://localhost:3000/api/v1/'
});

export default api_client;