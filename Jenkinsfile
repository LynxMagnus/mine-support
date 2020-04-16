@Library('defra-library@4') _

stage

buildNodeJs environment: 'dev', {
  stage('show var') {
    sh 'echo $HELM_CHART_REPO | base64'
  }
}