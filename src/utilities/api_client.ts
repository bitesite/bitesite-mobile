import axios from 'axios';
import environment from './environment';

const api_client = axios.create({
  baseURL: `${environment.apiHost}/api/v1/`,
  headers: {'Accept': 'application/json'},
});

export default api_client;