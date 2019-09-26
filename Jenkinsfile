node {
  checkout scm
  def registry = "https://562955126301.dkr.ecr.eu-west-2.amazonaws.com"
  def imageName = "ffc-demo-web"
  def tag = "jenkins"
    withEnv(["imageName=$imageName",
             'tag=jenkins']) {
    docker.withRegistry(registry, 'ecr:eu-west-2:ecr-user') {
      stage('Build Test Image') {
        sh 'ls -l ~/.docker/config.json'
        sh 'cat ~/.docker/config.json'
        sh 'echo $imageName'
        sh 'echo $tag'
        sh 'mkdir -p test-output'
        sh 'chmod 777 test-output'
        sh 'docker-compose -f docker-compose.yaml -f docker-compose.test.yaml build --no-cache ffc-demo-web'
      }
      try {
        stage('Test') {
          sh 'docker-compose -f docker-compose.yaml -f docker-compose.test.yaml up ffc-demo-web'
        }
      } finally {
          sh 'docker-compose -f docker-compose.yaml -f docker-compose.test.yaml down -v'
          junit 'test-output/junit.xml'
      }
      stage('Push Production Image') {
        sh 'docker-compose build --no-cache'
        sh 'docker tag ffc-demo-web 562955126301.dkr.ecr.eu-west-2.amazonaws.com/ffc-demo-web:jenkins'
        sh 'docker push 562955126301.dkr.ecr.eu-west-2.amazonaws.com/ffc-demo-web:jenkins'
      }
    }
  }
}
