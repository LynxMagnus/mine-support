@Library('defra-library')
import uk.gov.defra.ffc.DefraUtils
def defraUtils = new DefraUtils()

def registry = '562955126301.dkr.ecr.eu-west-2.amazonaws.com'
def regCredsId = 'ecr:eu-west-2:ecr-user'
def kubeCredsId = 'awskubeconfig002'
def ingressServer = 'ffc.aws-int.defra.cloud'
def imageName = 'ffc-demo-web'
def repoName = 'ffc-demo-web'
def pr = ''
def mergedPrNo = ''
def containerTag = ''

node {
  checkout scm
  try {
    stage('Set PR, and containerTag variables') {
      (pr, containerTag, mergedPrNo) = defraUtils.getVariables(repoName)
      defraUtils.updateGithubCommitStatus('Build started', 'PENDING')
    }
    stage('Build test image') {
      defraUtils.buildTestImage(imageName, BUILD_NUMBER)
    }
    stage('Run tests') {
      defraUtils.runTests(imageName, BUILD_NUMBER)
    }
    stage('Push container image') {
      defraUtils.pushContainerImage(registry, regCredsId, imageName, containerTag)
    }
    if (pr != '') {
      stage('Helm install') {
        withCredentials([
            string(credentialsId: 'albTags', variable: 'albTags'),
            string(credentialsId: 'albSecurityGroups', variable: 'albSecurityGroups'),
            string(credentialsId: 'albArn', variable: 'albArn')
          ]) {
          def extraCommands = "--values ./helm/ffc-demo-web/jenkins-aws.yaml --set name=ffc-demo-$containerTag,ingress.server=$ingressServer,ingress.endpoint=ffc-demo-$containerTag,ingress.alb.tags=\"$albTags\",ingress.alb.arn=\"$albArn\",ingress.alb.securityGroups=\"$albSecurityGroups\""
          defraUtils.deployPR(kubeCredsId, registry, imageName, containerTag, extraCommands)
          echo "Build available for review at https://ffc-demo-$containerTag.$ingressServer"
        }
      }
    }
    if (pr == '') {
      stage('Publish chart') {
        defraUtils.publishChart(registry, imageName, containerTag)
      }
    }
    if (mergedPrNo != '') {
      stage('Remove merged PR') {
        defraUtils.undeployPR(kubeCredsId, imageName, mergedPrNo)
      }
    }
    defraUtils.updateGithubCommitStatus('Build successful', 'SUCCESS')
  } catch(e) {
    defraUtils.updateGithubCommitStatus(e.message, 'FAILURE')
    throw e
  }
}
