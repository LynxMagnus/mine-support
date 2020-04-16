@Library('defra-library@4') _

stage('show var') {
  sh "echo $HELM_CHART_REPO | base64"
}

buildNodeJs environment: 'dev'