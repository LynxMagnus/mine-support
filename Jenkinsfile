@Library('defra-library@psd-882-add-acceptance-tests-stage') _

def runAcceptanceTests = {
  stage('Run acceptance tests') {
    try {
      dir('test/acceptance') {
        sh('mkdir -p -m 777 html-reports')

        echo '\n\n @@@@@\nDefaultURL\n'
        // First try on main deployment URL
        withEnv(['TEST_ENVIRONMENT_ROOT_URL=http://ffc-demo.ffc.snd.azure.defra.cloud']) {
          sh('wget $TEST_ENVIRONMENT_ROOT_URL')
          sh('docker-compose up --build --abort-on-container-exit')
        }

        echo '\n\n @@@@@\nPR namespace URL\n'
        sh('cp -r html-reports html-reports1')
        sh('rm -rf html-reports')
        sh('mkdir -p -m 777 html-reports')
        // Now try PR specific URL (but not https)
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