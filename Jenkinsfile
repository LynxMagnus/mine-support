@Library('defra-library@4') _

node {
  checkout scm

  stage('REPORT ENV') {
    sh 'pwd'
    sh 'ls -l'
    sh 'whoami'
    sh 'ls -l test-output'
  }
}

// buildNodeJs environment: 'dev'