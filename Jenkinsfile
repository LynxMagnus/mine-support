@Library('defra-library@v-8') _

def runAcceptanceTests = {
  stage('Run acceptance tests') {
    try {
      ctx.sh('cd test/acceptance'
      ctx.sh('mkdir -p -m 777 html-reports')
      // URL for running application - might need to be branch specific
      ctx.sh('export TEST_ENVIRONMENT_ROOT_URL=http://ffc-demo.ffc.snd.azure.defra.cloud')
      ctx.sh("docker-compose up --build")
    } finally {
      ctx.sh("docker-compose down -v")
    }
  }
}

buildNodeJs environment: 'dev', deployClosure: runAcceptanceTests