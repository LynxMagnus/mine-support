[![Known Vulnerabilities](https://snyk.io/test/github/DEFRA/ffc-demo-web/badge.svg?targetFile=package.json)](https://snyk.io/test/github/DEFRA/ffc-demo-web?targetFile=package.json)

# FFC Demo Service

Digital service mock to claim public money in the event property subsides into mine shaft.  This is the web front end for the application.  It contains a simple claim submission journey where user input data is cached in Redis.  On submission the data is pulled from Redis and passed to the message service.

## Prerequisites

AWS credentials with access to the container registry where FFC parent images are stored.

Either:
- Docker
- Docker Compose

Or:
- Kubernetes
- Helm

Or:
- Node 10
- Redis

## Environment variables

The following environment variables are required by the application container. Values for development are set in the Docker Compose configuration. Default values for production-like deployments are set in the Helm chart and may be overridden by build and release pipelines.

| Name                           | Description                               | Required | Default               | Valid                       | Notes                                                                             |
|--------------------------------|-------------------------------------------|:--------:|-----------------------|-----------------------------|-----------------------------------------------------------------------------------|
| NODE_ENV                       | Node environment                          | no       | development           | development,test,production         |                                                                                   |
| PORT                           | Port number                               | no       | 3000                  |                                     |                                                                                   |
| CACHE_NAME                     | Cache name                                | no       | redisCache            |                                     |                                                                                   |
| REDIS_HOSTNAME                 | Redis host                                | no       | localhost             |                                     |                                                                                   |
| REDIS_PORT                     | Redis port                                | no       | 6379                  |                                     |                                                                                   |
| COOKIE_PASSWORD                | Redis cookie password                     | yes      |                       |                                     |                                                                                   |
| SESSION_TIMEOUT_IN_MINUTES     | Redis session timeout                     | no       | 30                    |                                     |                                                                                   |
| STATIC_CACHE_TIMEOUT_IN_MILLIS | static file cache timeout                 | no       | 54000 (15 minutes)    |                                     |                                                                                   |
| REST_CLIENT_TIMEOUT_IN_MILLIS  | Rest client timout                        | no       | 5000                  |                                     |                                                                                   |
| DEV_ACCESS_KEY_ID              | Local dev only access key Id              | no       |                       |                                     |                                                                                   |
| DEV_ACCESS_KEY                 | Local dev only access key Id              | no       |                       |                                     |                                                                                   |
| OKTA_ENABLED                   | set to true to enable Okta authentication | no       | "true"                |                                     |                                                                                   |
| OKTA_DOMAIN                    | Okta domain, i.e. `mysite.okta.com`       | no       |                       |                                     |                                                                                   |
| OKTA_CLIENT_ID                 | Client ID of Okta OpenID Connect app      | no       |                       |                                     |                                                                                   |
| OKTA_CLIENT_SECRET             | Client Secret of Okta OpenID Connect app  | no       |                       |                                     |                                                                                   |
| OKTA_AUTH_SERVER_ID            | ID of Okta custom authorisation server    | no       |                       |                                     |                                                                                   |
| SITE_URL                       | URL of site, i.e. https://mysite.com      | no       |                       |                                     |                                                                                   |
| MESSAGE_QUEUE_HOST             | Message queue host                        | no       |                       | myservicebus.servicebus.windows.net |                                                                                   |
| MESSAGE_QUEUE_PORT             | Message queue port                        | no       |                       | 5671,5672                           |                                                                                   |
| MESSAGE_QUEUE_TRANSPORT        | Message queue transport                   | yes      | tcp                   | tcp,ssl                             | standard port is 5671 for ssl, 5672 for tcp                                       |
| CLAIM_QUEUE_ADDRESS            | claim queue name                          | no       |                       | claim                               |                                                                                   |
| CLAIM_QUEUE_USER               | claim queue user name                     | no       |                       |                                     |                                                                                   |
| CLAIM_QUEUE_PASSWORD           | claim queue password                      | no       |                       |                                     |                                                                                   |
| APPINSIGHTS_INSTRUMENTATIONKEY | Key for application insight               | no       |                       |                                     | App insights only enabled if key is present. Note: Silently fails for invalid key |
| APPINSIGHTS_CLOUDROLE          | Role used for filtering metrics           | no       |                       |                                     | Set to `ffc-demo-web-local` in docker compose files                               |

The `/account` page is accessible only by authenticated users. Authentication uses either [Okta](https://www.okta.com/) or stubbed authentication (for local development only). 
To use the stubbed authentication set `OKTA_ENABLED` to `"false"`

Okta specific environment variables must be set if `OKTA_ENABLED` is set to `"true"`.
A valid Okta OpenID Connect application is required, and the Okta domain, client ID, Client Secret, Custom Authorisation
Server ID, and URL of the site must be set in the environment variables
`OKTA_DOMAIN`, `OKTA_CLIENT_ID`, `OKTA_CLIENT_SECRET`, `OKTA_AUTH_SERVER_ID`, and `SITE_URL` respectively.


Running the integration tests locally requires a message bus that supports AMQP 1.0 and (at a minimum) the following environment variables setting:
`MESSAGE_QUEUE_HOST`, `MESSAGE_QUEUE_PORT`, `CLAIM_QUEUE_USER`, `CLAIM_QUEUE_PASSWORD`

## How to run tests

A convenience script is provided to run automated tests in a containerised environment. This will rebuild images before running tests via docker-compose, using a combination of `docker-compose.yaml` and `docker-compose.test.yaml`. The command given to `docker-compose run` may be customised by passing arguments to the test script.

Examples:

```
# Run all tests
scripts/test

# Run only unit tests
scripts/test npm run test:unit
```

Alternatively, the same tests may be run locally via npm:

```
# Run tests without Docker
npm run test
```

### Test watcher

A more convenient way to run tests in development is to use a file watcher to automatically run tests each time associated files are modified. For this purpose, the default docker-compose configuration mounts all app, test and git files into the main `ffc-demo-web` container, enabling the test watcher to be run as shown below. The same approach may be used to execute arbitrary commands in the running app.

```
# Run unit test file watcher
docker-compose run ffc-demo-web npm run test:unit-watch

# Run all tests
docker-compose run ffc-demo-web npm test

# Open an interactive shell in the app container
docker-compose run ffc-demo-web sh
```

### Why the docker-compose.test.yaml exists

Given that tests can be run in the main ffc-demo-web container during development, it may not be obvious why `docker-compose.test.yaml` exists. It's main purpose is for CI pipelines, where tests need to run in a container without any ports forwarded from the host machine.

## Running the application

The application is designed to run in containerised environments, using Docker Compose in development and Kubernetes in production.

- A Helm chart is provided for production deployments to Kubernetes.

### Build container image

Container images are built using Docker Compose, with the same images used to run the service with either Docker Compose or Kubernetes.

When using the Docker Compose files in development the local `app` folder will be mounted on top of the `app` folder within the Docker container, hiding the css files that were generated during the Docker build.
For the site to render correctly locally `npm run build` must be run on the host system.


By default, the start script will build (or rebuild) images so there will rarely be a need to build images manually. However, this can be achieved through the Docker Compose [build](https://docs.docker.com/compose/reference/build/) command:

```
# Build container images
docker-compose build
```

### Start and stop the service

Use Docker Compose to run service locally.

`docker-compose up`

Additional Docker Compose files are provided for scenarios such as linking to other running services.

Link to other services:
```
docker-compose -f docker-compose.yaml -f docker-compose.override.yaml -f docker-compose.link.yaml up
```

### Test the service

This service posts messages to an AMQP 1.0 message broker so manual testing involves creating claims using the web UI and inspecting the appropriate message queue. The [start](./scripts/start) script runs [ActiveMQ Artemis](https://activemq.apache.org/components/artemis) alongside the application to provide the required message bus and broker.

The posted message queues can be inspected using the Artemis console UI hosted at http://localhost:8161/console/login (username: artemis, password: artemis). Messages should match the format of the sample JSON below.

Note: the messages will be posted to the ExpiryQueue until a queue is manually created in the ActiveMQ web console for the `claim` address.

```
{
  "claimId": "MINE123",
  "propertyType": "business",
  "accessible": false,
  "dateOfSubsidence": "2019-07-26T09:54:19.622Z",
  "mineType": ["gold"],
  "email": "test@email.com"
}
```

### Deploy to Kubernetes

For production deployments, a helm chart is included in the `.\helm` folder. This service connects to an AMQP 1.0 message broker, using credentials defined in [values.yaml](./helm/ffc-demo-web/values.yaml), which must be made available prior to deployment.

Scripts are provided to test the Helm chart by deploying the service, along with an appropriate message broker, into the current Helm/Kubernetes context.

```
# Deploy to current Kubernetes context
scripts/helm/install

# Remove from current Kubernetes context
scripts/helm/delete
```

#### Accessing the pod

The service is exposed via a Kubernetes ingress, which requires an ingress controller to be running on the cluster. For example, the NGINX Ingress Controller may be installed via Helm:

```
# Install nginx-ingress into its own namespace
helm install --namespace nginx-ingress nginx-ingress
```

Alternatively, a local port may be forwarded to the pod:

```
# Forward local port to the Kubernetes deployment
kubectl port-forward --namespace=ffc-demo deployment/ffc-demo-web 3000:3000
```

Once the port is forwarded or an ingress controller is installed, the service can be accessed and tested in the same way as described in the "Test the service" section above.

#### Probes

The service has both an Http readiness probe and an Http liveness probe configured to receive at the below end points.

Readiness: `/healthy`
Liveness: `/healthz`

#### Basic Authentication

When deployed with an NGINX Ingress Controller, the ingress may be protected with basic authentication by passing the `--auth` (or `-a`) flag to the [Helm install](./scripts/helm/install) script. This relies on `htpasswd`, which must be available on the host system, and will prompt for a username and password.

```
# Deploy to the current Helm context with basic auth enabled
scripts/helm/install --auth
```

__How basic auth is configured__

Basic authentication is enabled via labels on the ingress object. Those labels are read by the NGINX Ingress Controller and used to configure basic authentication for incoming traffic. One of the labels provides the name of a Kubernetes secret in which credentials are stored as the encoded output of a `htpasswd` command. The ingress controller uses the value of that secret to verify any basic auth attempt.

If it wasn't defined by the Helm chart, the secret could be created via the following command:

```
# Create basic auth secret for username 'defra'
kubectl create secret generic ffc-demo-basic-auth2 --from-literal "auth=$(htpasswd -n defra)"
```

#### Amazon Load Balancer

Settings are available in the Helm charts to use the Amazon Load Balancer Ingress Controller rather than an NGINX Ingress Controller.
Additional child settings below `ingress` are available allowing the user to set [resource tags](https://kubernetes-sigs.github.io/aws-alb-ingress-controller/guide/ingress/annotation/#tags) and the arn of an [SSL certificate](https://kubernetes-sigs.github.io/aws-alb-ingress-controller/guide/ingress/annotation/#certificate-arn), i.e.
```
ingress:
  alb:
    tags: Name=myservername,Environment=myEnv,Project=MyProject,ServiceType=LOB
    arn: arn:aws:acm:eu-west-2:123456:certificate/abcdef0000-123a-4321-abc8-a1234567z
```

### Running without containers

The application may be run natively on the local operating if a Redis server is available on `localhost:6379`. First build the application using:

`$ npm run build`

Now the application is ready to run:

`$ node app`

## Build Pipeline

The [Jenkinsfile](Jenkinsfile) performs the following tasks:
- Runs unit tests
- Publishes test result
- Pushes containers to the registry tagged with the PR number or release version
- Deploys PRs to a temporary end point for review
- Deletes PR deployments, containers, and namepace upon merge

Builds will be deployed into a namespace with the format `ffc-demo-{identifier}` where `{identifier}` is either the release version, the PR number, or the branch name.

The builds will be available at the URL `http://ffc-demo-{identifier}.{ingress-server}`, where `{ingress-server}` is r defined the [`values.yaml`](./helm/ffc-demo-web/values.yaml) at `ingress.server`. This is empty by default and is set during the build pipeline.

The temporary deployment requires a CNAME subdomain wildcard pointing to the public IP address of the ingress controller of the Kubernetes cluster. This can be simulated by updating your local `hosts` file with an entry for the build address set to the ingress controller's public IP address. On windows this would mean adding a line to `C:\Windows\System32\drivers\etc\hosts`, i.e. for PR 8 against the default ingress server this could be

xx.xx.xx.xx ffc-demo-pr8.my-ingress-server.co.uk

where `xx.xx.xx.xx` is the public IP Address of the Ingress Controller.

A detailed description on the build pipeline and PR work flow is available in the [Defra Confluence page](https://eaflood.atlassian.net/wiki/spaces/FFCPD/pages/1281359920/Build+Pipeline+and+PR+Workflow)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
