#!/usr/bin/env bash
set -euo pipefail

TEST_FILE="${1:-}"
if [[ -z "$TEST_FILE" ]]; then
  echo "Usage: REPORT_NAME=<name> $0 <path-to-test.js>"
  exit 1
fi

if ! command -v k6 >/dev/null 2>&1; then
  echo "k6 not found. Install with 'make install-k6' or use docker targets."
  exit 2
fi

REPORT_NAME="${REPORT_NAME:-report}"
REPORTS_DIR="reports"

mkdir -p "$REPORTS_DIR"

export REPORT_NAME
export REPORTS_DIR

k6 run "$TEST_FILE"
