@Library('defra-library@psd-882-add-acceptance-tests-stage') _

def runAcceptanceTests = {
  stage('Run acceptance tests') {
    try {
      dir('test/acceptance') {
        sh('mkdir -p -m 777 html-reports')

        // Try PR specific URL (but not https)
        withEnv(['TEST_ENVIRONMENT_ROOT_URL=https://ffc-demo-pr174.ffc.snd.azure.defra.cloud']) {
          sh('wget $TEST_ENVIRONMENT_ROOT_URL')
          sh('docker-compose up --build --abort-on-container-exit')
        }
      }
    } finally {
      sh('docker-compose down -v')
    }
  }
}

buildNodeJs environment: 'dev', deployClosure: runAcceptanceTests