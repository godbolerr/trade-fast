import axios from 'axios';
import { logError } from '../util/log-util';

const TIMEOUT = 10000;
const setupAxiosInterceptors = (onUnauthenticated, clearAuthToken) => {
  const onRequestSuccess = (config) => {
    config.timeout = TIMEOUT;
    return config;
  };
  const onResponseSuccess = response => response;
  const onResponseError = (err) => {
    logError(err);
    const status = err.status || err.response.status;
    if (status === 403 || status === 401) {
      clearAuthToken();
      onUnauthenticated();
    }
    return Promise.reject(err);
  };
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
