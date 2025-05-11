export const CONFIG = {
  APP_NAME: 'Bank Thing',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Simple banking app',

  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'localhost:9095',
    VERSION: 'v1',
  },

  EXTERNAL: {
    TERMS: 'https://gowtham.io',
    PRIVACY: 'https://gowtham.io',
    SUPPORT: 'https://gowtham.io',
  },

  LOCAL_STORAGE_KEYS: {
    SETTINGS: 'bank-thing-settings',
    AUTH: 'bank-thing-auth',
    CONTRACT: 'bank-thing-contract',
  },
};
