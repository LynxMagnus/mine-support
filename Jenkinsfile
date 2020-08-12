@Library('defra-library@psd-882-add-acceptance-tests-stage') _

def runAcceptanceTests = {
  stage('Run acceptance tests') {
    try {
      dir('test/acceptance') {
        sh('mkdir -p -m 777 html-reports')
        (repoName, pr, tag, mergedPrNo) = build.getVariables(version.getPackageJsonVersion())
        echo("repoName, pr, tag, mergedPrNo: $repoName, $pr, $tag, $mergedPrNo")
        if (mergedPrNo != '') {
          withEnv(["TEST_ENVIRONMENT_ROOT_URL=http://ffc-demo-${mergedPrNo}.ffc.snd.azure.defra.cloud"]) {
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