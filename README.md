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
- Ubuntu/Debian: install via Makefile target install-k6 (or see OS-specific commands below)
- macOS: brew install k6
- Windows: choco install k6 or winget install k6

Option B: Docker
- Docker installed; uses grafana/k6 image

Quick Start (all OS)
1) Clone
   git clone https://github.com/Pradeepchandra6903/K6_PerfTesting.git
   cd K6_PerfTesting

2) Choose one path to run tests:
   - Makefile (Linux/macOS): preferred for simplicity
   - Docker (any OS): no local k6 install required
   - Direct k6 command (all OS): shown below for clarity

3) Run sample tests (pick ONE of these three approaches)

A) Makefile (Linux/macOS)
- Install k6 on Ubuntu/Debian:
  make install-k6
- Run API test and generate HTML:
  make test-api
- Run Web HTTP flow and generate HTML:
  make test-web
- Run all:
  make test-all

B) Docker (no local k6 needed; ensure Docker is installed and running)
- API:
  make docker-test-api
- Web:
  make docker-test-web
- All:
  make docker-test-all

C) Direct k6 commands (no Makefile; useful for Windows or explicit control)
- Linux/macOS (bash/zsh):
  export REPORTS_DIR=reports
  mkdir -p "$REPORTS_DIR"
  export REPORT_NAME=api_sample_$(date +%Y%m%d_%H%M%S)
  k6 run tests/api/sample_api_test.js
  export REPORT_NAME=web_sample_$(date +%Y%m%d_%H%M%S)
  k6 run tests/web/sample_web_test.js

- Windows PowerShell:
  $env:REPORTS_DIR="reports"
  New-Item -ItemType Directory -Force -Path $env:REPORTS_DIR | Out-Null
  $env:REPORT_NAME="api_sample_$(Get-Date -Format yyyyMMdd_HHmmss)"
  k6 run tests/api/sample_api_test.js
  $env:REPORT_NAME="web_sample_$(Get-Date -Format yyyyMMdd_HHmmss)"
  k6 run tests/web/sample_web_test.js

- Windows CMD:
  set REPORTS_DIR=reports
  if not exist reports mkdir reports
  for /f "tokens=1-4 delims=/ " %a in ("%date%") do set d=%d:~10,4%%d:~4,2%%d:~7,2%
  for /f "tokens=1-2 delims=:." %a in ("%time%") do set t=%a%b
  set REPORT_NAME=api_sample_%d%_%t%
  k6 run tests/api/sample_api_test.js
  set REPORT_NAME=web_sample_%d%_%t%
  k6 run tests/web/sample_web_test.js

OS-specific installation

Ubuntu/Debian (via Makefile target)
- Uses official k6 apt repo:
  make install-k6
- Verify:
  k6 version

macOS (Homebrew)
- Install:
  brew install k6
- Verify:
  k6 version

Windows
- Using Chocolatey:
  choco install k6 -y
- Or using Winget:
  winget install k6 -e --id k6.k6
- Verify (PowerShell/CMD):
  k6 version

Reports
- HTML reports are generated under reports/ with timestamped filenames:
  - reports/api_sample_<timestamp>.html
  - reports/web_sample_<timestamp>.html
- reports/*.html are gitignored and NOT committed; produce them locally for verification and in CI for archiving.
Configuration
- Edit config/default.json to change:
  - api.baseUrl, api.headers
  - web.baseUrl
  - options.vus, options.duration
  - options.tags
  - options.thresholds (e.g., "http_req_duration": ["p(95)<3000"])

How HTML Reporting Works
- Each test implements handleSummary using the HTML reporter:
  - https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js
- handleSummary writes an HTML file. The filename is controlled by env var REPORT_NAME and directory by REPORTS_DIR.

Examples to run tests with explicit env vars
- Linux/macOS:
  REPORTS_DIR=reports REPORT_NAME=api_sample_$(date +%Y%m%d_%H%M%S) k6 run tests/api/sample_api_test.js
  REPORTS_DIR=reports REPORT_NAME=web_sample_$(date +%Y%m%d_%H%M%S) k6 run tests/web/sample_web_test.js
- Windows PowerShell:
  $env:REPORTS_DIR="reports"; $env:REPORT_NAME="api_sample_$(Get-Date -Format yyyyMMdd_HHmmss)"; k6 run tests/api/sample_api_test.js
  $env:REPORTS_DIR="reports"; $env:REPORT_NAME="web_sample_$(Get-Date -Format yyyyMMdd_HHmmss)"; k6 run tests/web/sample_web_test.js
- Windows CMD:
  set REPORTS_DIR=reports && set REPORT_NAME=api_sample_%date:/=%_%time::=% && k6 run tests\api\sample_api_test.js
  set REPORTS_DIR=reports && set REPORT_NAME=web_sample_%date:/=%_%time::=% && k6 run tests\web\sample_web_test.js

Local Commands (Make)
- install-k6        Install official k6 apt repo and package (Ubuntu/Debian)
- test-api          Run API sample and produce HTML
- test-web          Run Web HTTP sample and produce HTML
- test-all          Run both tests
- clean             Remove generated reports

Docker Usage (explicit commands)
- API:
  docker run --rm -e REPORTS_DIR=reports -e REPORT_NAME=api_sample_$(date +%Y%m%d_%H%M%S) -v "$PWD":/work -w /work grafana/k6:latest run tests/api/sample_api_test.js
- Web:
  docker run --rm -e REPORTS_DIR=reports -e REPORT_NAME=web_sample_$(date +%Y%m%d_%H%M%S) -v "$PWD":/work -w /work grafana/k6:latest run tests/web/sample_web_test.js

Jenkins (both options supported)
- See Jenkinsfile for a declarative pipeline:
  - Stages: checkout, setup (optional), run tests, archive reports, post results
- Parameters:
  - TEST_SUITE: api, web, or all
  - USE_DOCKER: true to run via grafana/k6 Docker image; false to install k6 on agent
- Artifacts:
  - Archives reports/*.html
- Example Jenkinsfile usage:
  - USE_DOCKER=false, TEST_SUITE=all => agent installs k6 (Makefile target) and runs make test-all
  - USE_DOCKER=true, TEST_SUITE=api => runs make docker-test-api

Exact Steps (Demo Sequence)
1) Ubuntu/Debian:
   - make install-k6
   - make test-api
   - make test-web
2) macOS:
   - brew install k6
   - REPORTS_DIR=reports REPORT_NAME=api_sample_$(date +%Y%m%d_%H%M%S) k6 run tests/api/sample_api_test.js
   - REPORTS_DIR=reports REPORT_NAME=web_sample_$(date +%Y%m%d_%H%M%S) k6 run tests/web/sample_web_test.js
3) Windows (PowerShell):
   - choco install k6 -y   or   winget install k6 -e --id k6.k6
   - $env:REPORTS_DIR="reports"; $env:REPORT_NAME="api_sample_$(Get-Date -Format yyyyMMdd_HHmmss)"; k6 run tests/api/sample_api_test.js
   - $env:REPORTS_DIR="reports"; $env:REPORT_NAME="web_sample_$(Get-Date -Format yyyyMMdd_HHmmss)"; k6 run tests/web/sample_web_test.js
4) Docker (any OS):
   - make docker-test-api
   - make docker-test-web
5) Confirm HTML files under reports/ (not committed to git)

Notes
- No Grafana/InfluxDB used
- Public endpoints are used (httpbin, test.k6.io), suitable for demos
- Thresholds are configured for demo stability; tune them as needed in config/default.json
