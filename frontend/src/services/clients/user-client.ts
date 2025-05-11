import type { AxiosInstance, AxiosResponse } from 'axios';

import type { UserDto, LoginRequestDto, LoginResponseDto, RegisterRequestDto } from '../types';

// ------------------------------------------------------------------------

export default class UserClient {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async login(payload: LoginRequestDto): Promise<AxiosResponse<LoginResponseDto>> {
    return this.client.post('/login', payload);
  }

  async register(payload: RegisterRequestDto): Promise<AxiosResponse<UserDto>> {
    return this.client.post('/register', payload);
  }

  async current(): Promise<AxiosResponse<UserDto>> {
    return this.client.get('/current');
  }

  async completeOnboarding(): Promise<AxiosResponse<UserDto>> {
    return this.client.post('/onboarding/complete');
  }
}
