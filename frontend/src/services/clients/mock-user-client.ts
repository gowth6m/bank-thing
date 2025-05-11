import type { AxiosInstance, AxiosResponse } from 'axios';

import { SERVICE_CONFIG } from '../config';
import { mockAxiosResponse } from '../utils/mock';
import { mockUserResponse, mockUserLoginResponse } from '../_mock/user';

import type { UserDto, LoginRequestDto, LoginResponseDto, RegisterRequestDto } from '../types';

// ------------------------------------------------------------------------

export default class MockUserClient {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async login(payload: LoginRequestDto): Promise<AxiosResponse<LoginResponseDto>> {
    console.log('payload: ', payload);
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAxiosResponse<LoginResponseDto>(mockUserLoginResponse));
      }, SERVICE_CONFIG.MOCK_SERVER_DELAY);
    });
  }

  async register(payload: RegisterRequestDto): Promise<AxiosResponse<UserDto>> {
    console.log('payload: ', payload);
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAxiosResponse<UserDto>(mockUserResponse));
      }, SERVICE_CONFIG.MOCK_SERVER_DELAY);
    });
  }

  async current(): Promise<AxiosResponse<UserDto>> {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAxiosResponse<UserDto>(mockUserResponse));
      }, SERVICE_CONFIG.MOCK_SERVER_DELAY);
    });
  }
}
