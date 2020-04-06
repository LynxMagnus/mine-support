@Library('defra-library@psd-649-value-file')
import uk.gov.defra.ffc.DefraUtils
def defraUtils = new DefraUtils()

def containerSrcFolder = '\\/home\\/node'
def containerTag = ''
def lcovFile = './test-output/lcov.info'
def localSrcFolder = '.'
def mergedPrNo = ''
def pr = ''
def serviceName = 'ffc-demo-web'
def sonarQubeEnv = 'SonarQube'
def sonarScanner = 'SonarScanner'
def timeoutInMinutes = 5
def credId = ''

node {
  checkout scm
  try {
    stage('Set GitHub status as pending'){
      build.setGithubStatusPending()
    }
    stage('TEST: Run new function'){
      credId = build.getHelmValuesFileCredentialId()
      echo "credId: $credId"
    }
    stage('Set GitHub status as success'){
      build.setGithubStatusSuccess()
    }
  } catch(e) {
    build.setGithubStatusFailure(e.message)
    throw e
  }
}
