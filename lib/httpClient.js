import http from 'k6/http';
import { check } from 'k6';

export function get(url, params = {}, expectedStatus = 200, checkName = 'GET status') {
  const res = http.get(url, params);
  check(res, {
    [checkName]: (r) => r.status === expectedStatus,
  });
  return res;
}

export function post(url, payload = {}, params = { headers: { 'Content-Type': 'application/json' } }, expectedStatus = 200, checkName = 'POST status') {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const res = http.post(url, body, params);
  check(res, {
    [checkName]: (r) => r.status === expectedStatus,
  });
  return res;
}
