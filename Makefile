SHELL := /bin/bash

K6_BIN ?= k6
TIMESTAMP := $(shell date +%Y%m%d_%H%M%S)
REPORTS_DIR := reports

.PHONY: install-k6 ensure-reports test-api test-web test-all clean docker-test-api docker-test-web docker-test-all

install-k6:
	@echo "Installing k6 via apt repository..."
	@sudo apt-get update -y
	@sudo apt-get install -y ca-certificates gnupg
	@sudo mkdir -p /etc/apt/keyrings
	@curl -fsSL https://dl.k6.io/key.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/k6-archive-keyring.gpg
	@echo "deb [signed-by=/etc/apt/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list >/dev/null
	@sudo apt-get update -y
	@sudo apt-get install -y k6
	@$(K6_BIN) version

ensure-reports:
	@mkdir -p $(REPORTS_DIR)

test-api: ensure-reports
	@echo "Running API sample test..."
	@REPORT_NAME=api_sample_$(TIMESTAMP) ./scripts/k6_run.sh tests/api/sample_api_test.js

test-web: ensure-reports
	@echo "Running Web sample test..."
	@REPORT_NAME=web_sample_$(TIMESTAMP) ./scripts/k6_run.sh tests/web/sample_web_test.js

test-all: test-api test-web
	@echo "All tests complete. Reports in $(REPORTS_DIR)/"

clean:
	@rm -rf $(REPORTS_DIR) || true
	@echo "Cleaned reports/"

docker-test-api: ensure-reports
	@echo "Running API sample test in Docker..."
	@docker run --rm -e REPORT_NAME=api_sample_$(TIMESTAMP) -v $$PWD:/work -w /work grafana/k6:latest run tests/api/sample_api_test.js

docker-test-web: ensure-reports
	@echo "Running Web sample test in Docker..."
	@docker run --rm -e REPORT_NAME=web_sample_$(TIMESTAMP) -v $$PWD:/work -w /work grafana/k6:latest run tests/web/sample_web_test.js

docker-test-all: docker-test-api docker-test-web
	@echo "All Docker tests complete. Reports in $(REPORTS_DIR)/"
