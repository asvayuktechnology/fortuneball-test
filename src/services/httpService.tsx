import axios from 'axios';
import { API_URL } from '@/libs/api/const';
import Cookies from 'js-cookie';
const HttpMethods = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  PUT: 'PUT',
  PATCH: 'PATCH',
};

const http = axios.create({
  baseURL: API_URL,
});
http.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken');
    if (token) {
      config.headers.Authorization = token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      const hadToken = !!Cookies.get('authToken');
      Cookies.remove('authToken');

      // Only redirect when a session existed (expired/invalid token).
      // Guests browsing public pages should not be sent to login.
      if (hadToken) {
        console.warn("Unauthorized - Redirecting to login");
        window.location.href = '/login';
      }
    } else {
      console.error("API Error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);
const getAxiosClient = () => http;

// Add HTTP method functions
const get = (url: string, config?: any) => http.get(url, config);
const post = (url: string, data?: any, config?: any) => http.post(url, data, config);
const put = (url: string, data?: any, config?: any) => http.put(url, data, config);
const patch = (url: string, data?: any, config?: any) => http.patch(url, data, config);
const del = (url: string, config?: any) => http.delete(url, config);

const HttpService = {
  HttpMethods,
  getAxiosClient,
  get,
  post,
  put,
  patch,
  delete: del, // 'delete' is a reserved word in JavaScript
};

export default HttpService;