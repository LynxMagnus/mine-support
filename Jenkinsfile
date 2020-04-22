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

  test.deleteOutput(repoName, containerSrcFolder)

  stage('REPORT ENV2') {
    sh 'ls -l test-output'
    sh 'head -20 test-output/lcov.info'
  }
}

// buildNodeJs environment: 'dev'