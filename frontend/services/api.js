import axios from 'axios';

let apiBaseUrl = 'http://localhost:5000/api';
if (typeof window !== 'undefined') {
  // If being accessed over a local network (e.g. 172.x.x.x), dynamically route the API calls 
  // to the same machine's backend port, rather than strict localhost.
  apiBaseUrl = `http://${window.location.hostname}:5000/api`;
}

const api = axios.create({
  baseURL: apiBaseUrl, 
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    // We'll read the token conditionally if we run on client
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
