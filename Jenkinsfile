@Library('defra-library@psd-824-audit-in-container') _

def containerWorkDir = '\\/home\\/node'
def containerImage = 'defradigital/node-development'
def auditLevel = 'moderate'
def logType = 'parseable'

  def npmAudit(auditLevel, logType, failOnIssues, containerImage, containerWorkDir) {
    auditLevel = auditLevel ?: 'moderate'
    logType = logType ?: 'parseable'
    failOnIssues = failOnIssues ?: false
    // setting `returnStatus` means the sh cmd can return non-zero exit codes
    // without affecting the build status
    def script = "docker run --rm -u node " + 
    "--mount type=bind,source='$WORKSPACE/package.json',target=$containerWorkDir/package.json " +
    "--mount type=bind,source='$WORKSPACE/package-lock.json',target=$containerWorkDir/package-lock.json " +
    "$containerImage npm audit --audit-level=$auditLevel --$logType"
    sh(script)
  }

  node {
    checkout scm
    stage('test npm audit') {
      npmAudit('moderate', 'parseable', false, containerImage, containerWorkDir)
      // sh("docker run --rm -u node --mount type=bind,source='$WORKSPACE/package.json',target=$containerWorkDir/package.json --mount type=bind,source='$WORKSPACE/package-lock.json',target=$containerWorkDir/package-lock.json $containerImage npm audit --audit-level=$auditLevel --$logType")
    }
  }
