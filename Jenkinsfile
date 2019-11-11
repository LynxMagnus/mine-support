@Library('defra-library@psd-190-support-default-image-names')
import uk.gov.defra.ffc.DefraUtils
def defraUtils = new DefraUtils()

def registry = '562955126301.dkr.ecr.eu-west-2.amazonaws.com'
def regCredsId = 'ecr:eu-west-2:ecr-user'
def kubeCredsId = 'awskubeconfig002'
def ingressServer = 'ffc.aws-int.defra.cloud'
def projectName = 'ffc-demo-web'
def serviceName = 'app'
def pr = ''
def mergedPrNo = ''
def containerTag = ''

node {
  checkout scm
  try {
    stage('Set PR, and containerTag variables') {
      (pr, containerTag, mergedPrNo) = defraUtils.getVariables(projectName)
      defraUtils.setGithubStatusPending()
    }
    stage('Build test image') {
      defraUtils.buildTestImage(projectName, serviceName, BUILD_NUMBER)
    }
    stage('Run tests') {
      defraUtils.runTests(projectName, serviceName, BUILD_NUMBER)
    }
    stage('Push container image') {
      defraUtils.buildAndPushContainerImage(regCredsId, projectName, serviceName, registry, containerTag)
    }
    if (pr != '') {
      stage('Helm install') {
        withCredentials([
            string(credentialsId: 'albTags', variable: 'albTags'),
            string(credentialsId: 'albSecurityGroups', variable: 'albSecurityGroups'),
            string(credentialsId: 'albArn', variable: 'albArn')
          ]) {
          def extraCommands = "--values ./helm/ffc-demo-web/jenkins-aws.yaml --set name=ffc-demo-$containerTag,ingress.server=$ingressServer,ingress.endpoint=ffc-demo-$containerTag,ingress.alb.tags=\"$albTags\",ingress.alb.arn=\"$albArn\",ingress.alb.securityGroups=\"$albSecurityGroups\""
          defraUtils.deployChart(kubeCredsId, projectName, registry, containerTag, extraCommands)
          echo "Build available for review at https://ffc-demo-$containerTag.$ingressServer"
        }
      }
    }
    if (pr == '') {
      stage('Publish chart') {
        defraUtils.publishChart(projectName, serviceName, registry, containerTag)
      }
      stage('Trigger Deployment') {
        withCredentials([
          string(credentialsId: 'JenkinsDeployUrl', variable: 'jenkinsDeployUrl'),
          string(credentialsId: 'ffc-demo-web-deploy-token', variable: 'jenkinsToken')
        ]) {
          defraUtils.triggerDeploy(jenkinsDeployUrl, 'ffc-demo-web-deploy', jenkinsToken, ['chartVersion':'1.0.0'])
        }
      }
    }
    if (mergedPrNo != '') {
      stage('Remove merged PR') {
        defraUtils.undeployChart(kubeCredsId, imageName, mergedPrNo)
      }
    }
    defraUtils.setGithubStatusSuccess()
  } catch(e) {
    defraUtils.setGithubStatusFailure(e.message)
    throw e
  }
}
