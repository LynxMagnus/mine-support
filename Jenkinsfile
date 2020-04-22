@Library('defra-library@4') _

node {
  stage('REPORT ENV1') {
    sh 'whoami'
    sh 'pwd'
    sh 'ls -l'
    sh 'ls -l test-output'
  }

  checkout scm

  stage('REPORT ENV2') {
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

  stage('Run tests') {
    build.runTests(repoName, repoName, BUILD_NUMBER)
  }

  stage('REPORT ENV3') {
    sh 'ls -l test-output'
    sh 'head -20 test-output/lcov.info'
  }
}

// buildNodeJs environment: 'dev'