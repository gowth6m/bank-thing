import type { AxiosResponse } from 'axios';

interface mockAxiosResponseOptions {
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

export function mockAxiosResponse<T>(
  data: any,
  options?: mockAxiosResponseOptions
): AxiosResponse<T> {
  return {
    data,
    status: options?.status ?? 200,
    statusText: options?.statusText ?? 'success',
    headers: options?.headers,
    config: options?.config,
    request: options?.request,
  };
}
