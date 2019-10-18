def registry = '562955126301.dkr.ecr.eu-west-2.amazonaws.com'
def imageName = 'ffc-demo-web'
def repoName = 'ffc-demo-web'
def branch = ''
def pr = ''
def containerTag = ''

def getVariables(repoName) {
    def branch = sh(returnStdout: true, script: 'git ls-remote --heads origin | grep $(git rev-parse HEAD) | cut -d / -f 3').trim()
    def pr = sh(returnStdout: true, script: "curl https://api.github.com/repos/DEFRA/$repoName/pulls?state=open | jq '.[] | select(.head.ref | contains(\"$branch\")) | .number'").trim()
    def rawTag = pr == '' ? branch : pr
    def containerTag = rawTag.replaceAll(/[^a-zA-Z0-9]/, '-').toLowerCase()
    return [branch, pr, containerTag]
}

def buildTestImage(name, suffix) {
  sh 'docker image prune -f'
  // NOTE: the docker-compose file currently makes use of env vars for image names
  sh "docker-compose -p $name-$suffix -f docker-compose.yaml -f docker-compose.test.yaml build --no-cache $name"
}

def runTests(name, suffix) {
  try {
    sh 'mkdir -p test-output'
    sh 'chmod 777 test-output'
    sh "docker-compose -p $name-$suffix -f docker-compose.yaml -f docker-compose.test.yaml up $name"

  } finally {
    sh "docker-compose -p $name-$suffix -f docker-compose.yaml -f docker-compose.test.yaml down -v"
    junit 'test-output/junit.xml'
    // clean up files created by node/ubuntu user
    sh "docker run -u node --mount type=bind,source=$WORKSPACE/test-output,target=/usr/src/app/test-output $name rm -rf test-output/*"
  }
}

def pushContainerImage(registry, credentialsId, imageName, tag) {
  docker.withRegistry("https://$registry", credentialsId) {
    sh "docker-compose build --no-cache"
    sh "docker tag $imageName $registry/$imageName:$tag"
    sh "docker push $registry/$imageName:$tag"
  }
}

def publishChart(imageName) {
  // jenkins doesn't tidy up folder, remove old charts before running
  sh "rm -rf helm-charts"
  sshagent(credentials: ['helm-chart-creds']) {
    sh "git clone git@gitlab.ffc.aws-int.defra.cloud:helm/helm-charts.git"
    dir('helm-charts') {
      sh 'helm init -c'
      sh "helm package ../helm/$imageName"
      sh 'helm repo index .'
      sh 'git config --global user.email "buildserver@defra.gov.uk"'
      sh 'git config --global user.name "buildserver"'
      sh 'git checkout master'
      sh 'git add -A'
      sh "git commit -m 'update $imageName helm chart from build job'"
      sh 'git push'
    }
  }
}

node {
  checkout scm
  stage('Set branch, PR, and containerTag variables') {
    (branch, pr, containerTag) = getVariables(repoName)
  }
  stage('Build test image') {
    buildTestImage(imageName, BUILD_NUMBER)
  }
  stage('Run tests') {
      runTests(imageName, BUILD_NUMBER)
  }
  stage('Push container image') {
    pushContainerImage(registry, 'ecr:eu-west-2:ecr-user', imageName, containerTag)
  }
  if (pr != '') {
    stage('Helm install') {
      withKubeConfig([credentialsId: 'awskubeconfig002']) {
        sh "helm upgrade $imageName-$containerTag --install --namespace $imageName-$containerTag --values ./helm/ffc-demo-web/jenkins-aws.yaml ./helm/ffc-demo-web --set image=$registry/$imageName:$containerTag,name=ffc-demo-$containerTag,ingress.endpoint=ffc-demo-$containerTag"
      }
    }
  }
  if (pr == '') {
    stage('Publish chart') {
      publishChart(imageName)
    }
  }
}

