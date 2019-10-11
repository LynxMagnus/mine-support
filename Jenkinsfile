
def registry = "562955126301.dkr.ecr.eu-west-2.amazonaws.com"
def imageName = "ffc-demo-web"
def tag = "jenkins"
def namespace = "ffc-demo"

def pr = PR == 'unknown' ? '' : PR
def tag = pr ?: branch
node {
  checkout scm
  docker.withRegistry("https://$registry", 'ecr:eu-west-2:ecr-user') {
    stage('Publish chart') {
      dir('HelmCharts') {
        sh "PR $PR"
        sh "branch $pr"
        sh "tag $tag"
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/master']],
          userRemoteConfigs: [[credentialsId: 'helm-chart-creds', url: 'git@gitlab.ffc.aws-int.defra.cloud:helm/helm-charts.git']],
          poll: false,
          changelog: false
          ])

        sh "helm init -c"
        sh "helm package ../helm/ffc-demo-web"
        sh 'git config --global user.email "mark.harrop@defra.gov.uk"'
        sh 'git config --global user.name "mharrop"'
        sh "git add -u"
        sh "git commit -m 'update helm chart from build job'"
        sh "git remote -v"
        sshagent(credentials: ['helm-chart-creds']) {
          sh "git push  --set-upstream origin master"
        }
      }
    }    
    stage('Build Test Image') {
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
    }
    stage('Push Production Image') {
      sh "docker-compose build --no-cache"
      sh "docker tag $imageName $registry/$imageName:$tag"
      sh "docker push $registry/$imageName:$tag"
    }
    stage('Helm install') {
      withKubeConfig([credentialsId: 'awskubeconfig001']) {
        sh "helm upgrade $imageName --install --namespace $namespace --values ./helm/ffc-demo-web/jenkins-eks.yaml ./helm/ffc-demo-web"
      }
    }
  }
}

