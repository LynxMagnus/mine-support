@Library('defra-library@refactor-global-vars')

def containerSrcFolder = '\\/home\\/node'
def containerTag = ''
def mergedPrNo = ''
def pr = ''
def timeoutInMinutes = 5
def repoName = ''

node {
  checkout scm
  try {
    stage('Set PR, and containerTag variables') {
      (repoName, pr, containerTag, mergedPrNo) = build.getVariables()
      echo "repoName: $repoName"
      echo "pr: $pr"
      echo "containerTag: $containerTag"
      echo "mergedPrNo: $mergedPrNo"
    }
    stage('Set GitHub status as pending'){
      build.setGithubStatusPending()
    }
    stage('Set GitHub status as success'){
      build.setGithubStatusSuccess()
    }
  } catch(e) {
    build.setGithubStatusFailure(e.message)
    throw e
  }
}
