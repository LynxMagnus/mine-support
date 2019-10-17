def registry = "562955126301.dkr.ecr.eu-west-2.amazonaws.com"
def imageName = "ffc-demo-web"
def branch = ''
def pr = ''
def rawTag = pr ?: branch
def containerTag = rawTag.replaceAll(/[^a-zA-Z0-9]/, '-').toLowerCase()
def namespace = "${imageName}-${containerTag}"

node {
  checkout scm
  docker.withRegistry("https://$registry", 'ecr:eu-west-2:ecr-user') {
    stage('Build Test Image') {
      sh 'git ls-remote --heads origin | grep $(git rev-parse HEAD) | cut -d / -f 3'
      sh "echo branch $branch"
      sh "echo containerTag $containerTag"
      sh 'env'
      sh 'docker image prune -f'
      sh "docker-compose -p $imageName-$BUILD_NUMBER -f docker-compose.yaml -f docker-compose.test.yaml build --no-cache $imageName"
    }
    try {
      stage('Test') {
        sh 'mkdir -p test-output'
        sh 'chmod 777 test-output'
        sh "docker-compose -p $imageName-$BUILD_NUMBER -f docker-compose.yaml -f docker-compose.test.yaml up $imageName"
      }
    } finally {
        sh "docker-compose -p $imageName-$BUILD_NUMBER -f docker-compose.yaml -f docker-compose.test.yaml down -v"
        junit 'test-output/junit.xml'
        sh "docker run -u node --mount type=bind,source=$WORKSPACE/test-output,target=/usr/src/app/test-output $imageName rm -rf test-output/*"
    }
    stage('Push Production Image') {
      sh "docker-compose build --no-cache"
      sh "docker tag $imageName $registry/$imageName:$containerTag"
      sh "docker push $registry/$imageName:$containerTag"
    }
    stage('Helm install') {
      withKubeConfig([credentialsId: 'awskubeconfig001']) {
        sh "helm upgrade $imageName-$containerTag --debug --dry-run --install --namespace $namespace --values ./helm/ffc-demo-web/jenkins-aws.yaml ./helm/ffc-demo-web --set image=$registry/$imageName:$containerTag"
      }
    }
    stage('Publish chart') {
      if (pr == '') {
        // jenkins doesn't tidy up folder, remove old charts before running
        sh "rm -rf helm-charts"
        sh "echo $PR"
        sshagent(credentials: ['helm-chart-creds']) {
          sh "git clone git@gitlab.ffc.aws-int.defra.cloud:helm/helm-charts.git"
          dir('helm-charts') {
            sh "helm init -c"
            sh "helm package ../helm/ffc-demo-web"
            sh "helm repo index ."
            sh 'git config --global user.email "mark.harrop@defra.gov.uk"'
            sh 'git config --global user.name "mharrop"'
            sh 'git checkout master'
            sh "git add -A"
            sh "git commit -m 'update helm chart from build job'"
            sh "git push"
          }
        }
      }
    }
  }
}

