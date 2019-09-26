node {
  checkout scm
  def registry = "562955126301.dkr.ecr.eu-west-2.amazonaws.com"
  def imageName = "ffc-demo-web"
  def tag = "jenkins"
    withEnv([
      "registry=$registry",
      "imageName=$imageName",
      "tag=$tag"
    ]) {
    docker.withRegistry("https://$registry", 'ecr:eu-west-2:ecr-user') {
      stage('Build Test Image') {
        sh 'echo $registry'
        sh 'echo $imageName'
        sh 'echo $tag'
        sh 'mkdir -p test-output'
        sh 'chmod 777 test-output'
        sh 'docker-compose -f docker-compose.yaml -f docker-compose.test.yaml build --no-cache $imageName'
      }
      try {
        stage('Test') {
          sh 'docker-compose -f docker-compose.yaml -f docker-compose.test.yaml up $imageName'
        }
      } finally {
          sh 'docker-compose -f docker-compose.yaml -f docker-compose.test.yaml down -v'
          junit 'test-output/junit.xml'
      }
      stage('Push Production Image') {
        sh 'docker-compose build --no-cache'
        sh 'docker tag ffc-demo-web $registry/$imageName:$tag'
        sh 'docker push $registry/$imageName:$tag'
      }
    }
  }
}
