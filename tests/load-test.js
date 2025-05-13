import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m', target: 300 },
    { duration: '1m', target: 500 },
    { duration: '2m', target: 1000 },
    { duration: '30s', target: 0 },
  ],
};

export function setup() {
  const loginRes = http.post('https://api.bank-thing.gowtham.io/v1/auth/login', JSON.stringify({
    email: 'user@load.test',
    password: '123456',
    remember: false,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const accessToken = loginRes.json('accessToken');
  if (!accessToken) {
    throw new Error(`Failed to get token. Status: ${loginRes.status}, Body: ${loginRes.body}`);
  }

  return { token: accessToken };
}

export default function (data) {
  const headers = {
    Authorization: `Bearer ${data.token}`,
  };

  // 1. Check /v1/auth/current
  const res1 = http.get('https://api.bank-thing.gowtham.io/v1/auth/current', { headers });
  check(res1, {
    'GET /auth/current is 200': (r) => r.status === 200,
  });

  // 2. Check /v1/bank/account/all
  const res2 = http.get('https://api.bank-thing.gowtham.io/v1/bank/account/all', { headers });
  check(res2, {
    'GET /bank/account/all is 200': (r) => r.status === 200,
  });

  sleep(1);
}
