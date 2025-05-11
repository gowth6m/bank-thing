import { CONFIG } from 'src/config';

export const SERVICE_CONFIG = {
  BASE_URL: window.location.protocol + '//' + CONFIG.API.BASE_URL + '/' + CONFIG.API.VERSION,
  MOCK_SERVER: false,
  MOCK_SERVER_DELAY: 1000,
};
