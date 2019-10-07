node {
  checkout scm
  def registry = "562955126301.dkr.ecr.eu-west-2.amazonaws.com"
  def imageName = "ffc-demo-web"
  def tag = "jenkins"
  def namespace = "ffc-demo"
  docker.withRegistry("https://$registry", 'ecr:eu-west-2:ecr-user') {
    stage('Build Test Image') {
      sh 'echo change ID: $CHANGE_ID'
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
        sh "helm upgrade $imageName --install --namespace $namespace --values ./helm/jenkins-eks.yaml ./helm"
      }
    }
  }
}
