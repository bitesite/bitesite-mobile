import axios from 'axios';
import environment from './environment';

const freshbooks_api_client = axios.create({
  baseURL: `https://api.freshbooks.com/`,
  headers: {
    'Accept': 'application/json',
    'Api-version': 'alpha',
    'Authorization': 'Bearer FILL_IN'
  },
});

export default freshbooks_api_client;