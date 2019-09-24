node{
  checkout scm
  docker.withRegistry('https://mhk8sregistry.azurecr.io/', 'mhk8sregistry') {
    stage('Build Test Image') {
      sh 'mkdir -p test-output'
      sh 'chmod 777 test-output'
      sh 'docker-compose -f docker-compose-test.yml build --no-cache test'
    }
    stage('Test') {
      sh 'docker-compose -f docker-compose-test.yml up --force-recreate test'
    }
  }
}
