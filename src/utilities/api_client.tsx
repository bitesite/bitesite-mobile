import axios from 'axios';

const api_client = axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
  headers: {'Accept': 'application/json'},
});

export default api_client;