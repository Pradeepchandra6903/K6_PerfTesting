# K6 Performance Testing Framework (HTML Reports Only)

This repo provides a ready-to-run performance testing framework using k6 with:
- API tests (GET and POST)
- Web HTTP flow tests (no browser automation; pure HTTP)
- Self-contained HTML reports (no Grafana/InfluxDB)
- Easy local run via Makefile or Docker
- Jenkins pipeline to run in CI and archive HTML artifacts

Contents
- tests/
  - api/sample_api_test.js
  - web/sample_web_test.js
- lib/httpClient.js
- config/default.json
- reports/ (generated)
- scripts/k6_run.sh
- Jenkinsfile
- Makefile

Prerequisites
Option A: Native k6
- Ubuntu/Debian: install via Makefile target install-k6
- macOS: brew install k6
- Windows: choco install k6 or winget install k6

Option B: Docker
- Docker installed; uses grafana/k6 image

Quick Start
1) Clone
   git clone https://github.com/Pradeepchandra6903/K6_PerfTesting.git
   cd K6_PerfTesting

2) Install k6 (Linux)
   make install-k6

3) Run sample API test and generate HTML
   make test-api

4) Run sample Web HTTP flow and generate HTML
   make test-web

5) Run all tests
   make test-all

Reports
- HTML reports are generated under reports/ with timestamped filenames:
  - reports/api_sample_<timestamp>.html
  - reports/web_sample_<timestamp>.html

Configuration
- Edit config/default.json to change:
  - base URLs
  - tags
  - default VUs and durations
  - thresholds

How HTML Reporting Works
- Each test implements handleSummary using the HTML reporter:
  - https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js
- handleSummary writes an HTML file. The filename is controlled by env var REPORT_NAME.
- Example:
  REPORT_NAME=api_sample k6 run tests/api/sample_api_test.js

Local Commands
- Make targets:
  - install-k6        Install official k6 apt repo and package (Ubuntu/Debian)
  - test-api          Run API sample and produce HTML
  - test-web          Run Web HTTP sample and produce HTML
  - test-all          Run both tests
  - clean             Remove generated reports

Docker Usage
- Run API test:
  make docker-test-api
- Run Web test:
  make docker-test-web
- Both:
  make docker-test-all

Jenkins
- See Jenkinsfile for a declarative pipeline:
  - Stages: checkout, setup (optional), run tests, archive reports, post results
  - Supports native k6 agent or Docker agent with grafana/k6
- Parameters:
  - TEST_SUITE: api, web, or all
  - USE_DOCKER: true/false
- Artifacts:
  - Archives reports/*.html

Exact Steps (Demo Sequence)
1) make install-k6
2) make test-api
3) make test-web
4) Confirm HTML files under reports/
5) Push branch and open PR
6) In Jenkins, create a multibranch pipeline or a pipeline with this Jenkinsfile
   - Set TEST_SUITE as needed
   - Run the job
   - View archived HTML in build artifacts

Notes
- No Grafana/InfluxDB used
- Public endpoints are used (httpbin, test.k6.io), suitable for demos
- Thresholds are configured to demonstrate pass/fail behavior; tune them as needed
