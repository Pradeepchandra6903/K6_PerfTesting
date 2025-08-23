import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { get, post } from '../../lib/httpClient.js';

const configRaw = JSON.parse(open('../../config/default.json'));

export const options = {
  vus: configRaw.options.vus,
  duration: configRaw.options.duration,
  tags: configRaw.options.tags,
  thresholds: configRaw.options.thresholds
};

export default function () {
  const base = configRaw.api.baseUrl;

  const getRes = get(`${base}/get?demo=1`, { headers: configRaw.api.headers }, 200, 'GET /get returns 200');
  check(getRes, {
    'GET body has args.demo=1': (r) => JSON.parse(r.body).args.demo === '1',
  });

  const postRes = post(`${base}/post`, { hello: 'world' }, { headers: configRaw.api.headers }, 200, 'POST /post returns 200');
  check(postRes, {
    'POST echoes JSON': (r) => JSON.parse(r.body).json.hello === 'world',
  });

  sleep(1);
}

export function handleSummary(data) {
  const name = __ENV.REPORT_NAME || 'api_report';
  const reportsDir = __ENV.REPORTS_DIR || 'reports';
  const file = `${reportsDir}/${name}.html`;
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    [file]: htmlReport(data),
  };
}
