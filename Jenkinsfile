@Library('defra-library@psd-824-audit-in-container') _

def containerWorkDir = '\\/home\\/node'
def containerImage = 'defradigital/node-development'
def auditLevel = 'moderate'
def logType = 'parseable'

  node {
    checkout scm
    stage('test npm audit') {
      sh("docker run --rm -u node --mount type=bind,source='$WORKSPACE/package.json',target=$containerWorkDir/package.json --mount type=bind,source='$WORKSPACE/package-lock.json',target=$containerWorkDir/package-lock.json $containerImage npm audit --audit-level=$auditLevel --$logType")
    }
  }
