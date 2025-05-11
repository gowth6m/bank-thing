import type { AxiosInstance } from 'axios';

import axios from 'axios';

import { useAuthStore } from 'src/stores/auth-store';

import EventClient from './event-client';
import { SERVICE_CONFIG } from './config';
import UserClient from './clients/user-client';
import BankClient from './clients/bank-client';
import MockUserClient from './clients/mock-user-client';

// ------------------------------------------------------------------------

const createAxiosInstance = (prefix: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${SERVICE_CONFIG.BASE_URL}${prefix}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const { token } = useAuthStore.getState();
      if (token?.access) {
        config.headers['Authorization'] = `Bearer ${token?.access}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.log('Unauthorized, please log in.');
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// ------------------------------------------------------------------------

class ApiClient {
  static user = SERVICE_CONFIG.MOCK_SERVER
    ? new MockUserClient(createAxiosInstance('/auth'))
    : new UserClient(createAxiosInstance(`/auth`));
  static bank = new BankClient(createAxiosInstance('/bank'));

  static events = new EventClient();
}

export default ApiClient;
