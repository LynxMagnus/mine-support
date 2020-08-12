@Library('defra-library@psd-882-add-acceptance-tests-stage') _

def runAcceptanceTests = {
  stage('Run acceptance tests') {
    try {
      dir('test/acceptance') {
        sh('mkdir -p -m 777 html-reports')
        def pr = utils.getMergedPrNo(ctx)
        if (pr != '') {
          withEnv(["TEST_ENVIRONMENT_ROOT_URL=http://ffc-demo-${pr}.ffc.snd.azure.defra.cloud"]) {
            sh('docker-compose up --build --abort-on-container-exit')
          }
        }
        else { 
          withEnv(['TEST_ENVIRONMENT_ROOT_URL=http://ffc-demo.ffc.snd.azure.defra.cloud']) {
            sh('docker-compose up --build --abort-on-container-exit')
          }
        }
      }
    } finally {
      sh('docker-compose down -v')
    }
  }
}

buildNodeJs environment: 'dev', deployClosure: runAcceptanceTests