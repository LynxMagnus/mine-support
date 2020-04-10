@Library('defra-library@fix-deployment') _

// buildNodeJs environment: 'dev'
node {
  stage("Test"){
    deploy.trigger(JENKINS_DEPLOY_SITE_ROOT, 'ffc-demo-web', 'defra', ['chartVersion': '1.0.33'])
  }
}
