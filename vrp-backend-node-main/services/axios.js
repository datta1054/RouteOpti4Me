import http from 'http'
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000'
const agent = new http.Agent({ family: 4 });
export const solverAxios = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  httpAgent: agent
});
