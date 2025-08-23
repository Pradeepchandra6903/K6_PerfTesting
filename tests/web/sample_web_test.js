import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

const configRaw = JSON.parse(open('../../config/default.json'));

export const options = {
  vus: configRaw.options.vus,
  duration: configRaw.options.duration,
  tags: { ...configRaw.options.tags, suite: 'web' },
  thresholds: configRaw.options.thresholds
};

export default function () {
  const base = configRaw.web.baseUrl;

  const resHome = http.get(`${base}/`);
  check(resHome, {
    'home status 200': (r) => r.status === 200,
    'home contains test.k6.io': (r) => r.body && r.body.includes('test.k6.io'),
  });

  const resNews = http.get(`${base}/news.php`);
  check(resNews, {
    'news status 200': (r) => r.status === 200,
  });

  const resContacts = http.get(`${base}/contacts.php`);
  check(resContacts, {
    'contacts status 200': (r) => r.status === 200,
  });

  sleep(1);
}

export function handleSummary(data) {
  const name = __ENV.REPORT_NAME || 'web_report';
  const reportsDir = __ENV.REPORTS_DIR || 'reports';
  const file = `${reportsDir}/${name}.html`;
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    [file]: htmlReport(data),
  };
}
