@Library('defra-library@4') _

def containerSrcFolder = '\\/home\\/node'

node {
  checkout scm

  stage('REPORT ENV1') {
    sh 'pwd'
    sh 'ls -l'
    sh 'ls -l test-output'
  }

  stage('Set PR, and containerTag variables') {
    (repoName, pr, containerTag, mergedPrNo) = build.getVariables(version.getPackageJsonVersion())
  }

  stage('Build test image') {
    build.buildTestImage(DOCKER_REGISTRY_CREDENTIALS_ID, DOCKER_REGISTRY, repoName, BUILD_NUMBER)
  }

  // stage('Run tests') {
  //   build.runTests(repoName, repoName, BUILD_NUMBER)
  // }

  // stage('Push container image') {
  //   build.buildAndPushContainerImage(DOCKER_REGISTRY_CREDENTIALS_ID, DOCKER_REGISTRY, repoName, containerTag)
  // }

  // stage('Delete test output') {
  //   test.deleteOutput(repoName, containerSrcFolder)
  // }

  stage('REPORT ENV2') {
    sh 'ls -l test-output'
    sh 'docker image ls'
  }
}

// buildNodeJs environment: 'dev'
