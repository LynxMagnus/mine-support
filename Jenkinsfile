@Library('defra-library@v-8') _

def runAcceptanceTests = {
  stage('Run acceptance tests') {
    try {
      dir('test/acceptance') {
        pwd
        sh('mkdir -p -m 777 html-reports')
        // URL for running application - might need to be PR specific, using the namespace
        // sh("export TEST_ENVIRONMENT_ROOT_URL=http://ffc-demo${namespace}.ffc.snd.azure.defra.cloud")
        sh('export TEST_ENVIRONMENT_ROOT_URL=http://ffc-demo.ffc.snd.azure.defra.cloud')
        sh('docker-compose up --build')
      }
    } finally {
      sh('docker-compose down -v')
    }
  }
}

buildNodeJs environment: 'dev', deployClosure: runAcceptanceTests