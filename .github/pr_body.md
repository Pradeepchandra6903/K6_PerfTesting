# feat: k6 performance testing framework with HTML reports, samples, docs, and Jenkins pipeline

Link to Devin run: https://app.devin.ai/sessions/26b4803089ab4461bfe00a67c0a58d38
Requested by: Pradeep Chandra (@Pradeepchandra6903)

Summary
- End-to-end k6 performance testing framework built from scratch
- API tests (GET/POST to httpbin.org) and Web HTTP flow tests (test.k6.io)
- Self-contained HTML reporting via benc-uk/k6-reporter (no Grafana/InfluxDB)
- Config-driven options (VUs, duration, thresholds, tags)
- Makefile for install and runs, with Docker alternatives
- Jenkinsfile supporting both native k6 install and Docker-based runs (parameterized)
- Clear README with exact step-by-step setup and demo sequence

Key Design Decisions
- HTML reports are not committed to git; reports/*.html are generated locally and in CI only
- Support both Jenkins options:
  - USE_DOCKER=true: run using grafana/k6 Docker image
  - USE_DOCKER=false: install k6 on the agent via apt (Makefile target)

Project Structure
- tests/
  - api/sample_api_test.js
  - web/sample_web_test.js
- lib/httpClient.js
- config/default.json
- scripts/k6_run.sh
- reports/ (generated; .gitkeep present, HTML files gitignored)
- Makefile
- Jenkinsfile
- README.md

How to run locally
1) make install-k6
2) make test-api
3) make test-web
4) Open the generated HTML files in reports/

Jenkins usage
- Parameters:
  - TEST_SUITE: api | web | all
  - USE_DOCKER: true | false
- Stages: Checkout, Setup (optional), Run Tests, Archive Reports
- Artifacts: reports/*.html archived

Notes
- No Grafana/InfluxDB used to keep the demo self-contained in HTML
- Public endpoints (httpbin.org, test.k6.io) used for predictable demos
- Thresholds tuned for demo stability; adjust in config/default.json as needed
