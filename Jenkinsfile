@Library('defra-library@4') _

node {
  checkout scm

  stage('REPORT ENV') {
    sh 'pwd'
    sh 'ls -l'
    sh 'whoami'
    sh 'ls -l test-output'
    sh 'head -20 test-output/lcov.info'
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

  stage('REPORT ENV2') {
    sh 'ls -l test-output'
    sh 'head -20 test-output/lcov.info'
  }
}

// buildNodeJs environment: 'dev'