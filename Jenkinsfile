def registry = "562955126301.dkr.ecr.eu-west-2.amazonaws.com"
def imageName = "ffc-demo-web"
def branch = BRANCH == 'unknown' ? "jenkins" : BRANCH

def pr = PR == 'unknown' ? '' : PR
def rawTag = pr ?: branch
def containerTag = rawTag.replaceAll(/[^a-zA-Z0-9]/, '-').toLowerCase()
def namespace = "${imageName}-${containerTag}"

node {
  checkout scm
  docker.withRegistry("https://$registry", 'ecr:eu-west-2:ecr-user') {
        stage('Publish chart') {
      if (pr == '') {
        // jenkins doesn't tidy up folder, remove old charts before running
        sh "rm -rf helm-charts"
        // dir('HelmCharts') {
        sh "echo $PR"
        sh "echo branch $branch"
        sh "echo containerTag $containerTag"
        // this should do the same as the command below, but gives a branch error on check in
        // git( 
        //   url: 'git@gitlab.ffc.aws-int.defra.cloud:helm/helm-charts.git',
        //   credentialsId: 'helm-chart-creds',
        //   changelog: false,
        //   poll: false
        // )
        // checkout([
        //   $class: 'GitSCM',
        //   extensions: [[$class: 'DisableRemotePoll']],
        //   branches: [[name: '*/master']],
        //   userRemoteConfigs: [[credentialsId: 'helm-chart-creds', url: 'git@gitlab.ffc.aws-int.defra.cloud:helm/helm-charts.git']],
        //   poll: false,
        //   changelog: false
        //   ])
        // the poll and changelog settings above seem to have no effect. The build reports it doesn't recognise the parameters
        // and an endless build cycles ensues as the Jenkins job considers the change to the charts rep reason to rebuild the parent repo
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
        sh "docker run -u node --mount type=bind,source=$WORKSPACE/test-output,target=/usr/src/app/test-output $imageName rm -rf test-output/*"
    }
    stage('Push Production Image') {
      sh "docker-compose build --no-cache"
      sh "docker tag $imageName $registry/$imageName:$containerTag"
      sh "docker push $registry/$imageName:$containerTag"
    }
    stage('Helm install') {
      withKubeConfig([credentialsId: 'awskubeconfig001']) {
        sh "helm upgrade $imageName-$containerTag --debug --dry-run --install --namespace $namespace --values ./helm/ffc-demo-web/jenkins-eks.yaml ./helm/ffc-demo-web --set image=$registry/$imageName:$containerTag" 
      }
    }
  }
}

