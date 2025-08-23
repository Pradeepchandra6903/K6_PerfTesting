pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
  }

  parameters {
    choice(name: 'TEST_SUITE', choices: ['api', 'web', 'all'], description: 'Which tests to run')
    booleanParam(name: 'USE_DOCKER', defaultValue: false, description: 'Run using grafana/k6 Docker image')
  }

  environment {
    REPORTS_DIR = "reports"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Setup') {
      when { expression { return !params.USE_DOCKER } }
      steps {
        sh 'make install-k6'
      }
    }

    stage('Run Tests') {
      steps {
        script {
          if (params.USE_DOCKER) {
            if (params.TEST_SUITE == 'api') {
              sh 'make docker-test-api'
            } else if (params.TEST_SUITE == 'web') {
              sh 'make docker-test-web'
            } else {
              sh 'make docker-test-all'
            }
          } else {
            if (params.TEST_SUITE == 'api') {
              sh 'make test-api'
            } else if (params.TEST_SUITE == 'web') {
              sh 'make test-web'
            } else {
              sh 'make test-all'
            }
          }
        }
      }
    }

    stage('Archive Reports') {
      steps {
        archiveArtifacts artifacts: 'reports/*.html', fingerprint: true, allowEmptyArchive: true
      }
    }
  }

  post {
    always {
      script {
        def files = sh(script: 'ls -1 reports/*.html 2>/dev/null || true', returnStdout: true).trim()
        if (files) {
          echo "Generated reports:\n${files}"
        } else {
          echo "No HTML reports found."
        }
      }
    }
    success {
      echo 'Performance tests completed successfully.'
    }
    unstable {
      echo 'Build is unstable due to thresholds or checks.'
    }
    failure {
      echo 'Performance tests failed.'
    }
  }
}
