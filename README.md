[![Known Vulnerabilities](https://snyk.io/test/github/DEFRA/ffc-demo-web/badge.svg?targetFile=package.json)](https://snyk.io/test/github/DEFRA/ffc-demo-web?targetFile=package.json)

# FFC Demo Service

Digital service mock to claim public money in the event property subsides into
mine shaft. This is the web front end for the application. It contains a
simple claim submission journey where user input data is cached in Redis. On
submission the data is pulled from Redis and passed to the message service.

## Prerequisites

Access to an instance of an
[Azure Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/)(ASB).
And either:
- Docker
- Docker Compose

Or:
- Kubernetes
- Helm

Or:
- Node 10+
- Redis

### Azure Service Bus

This service depends on a valid Azure Service Bus connection string for
asynchronous communication.  The following environment variables need to be set
in any non-production (`!config.isProd`) environment before the Docker
container is started. When deployed into an appropriately configured AKS
cluster (where [AAD Pod Identity](https://github.com/Azure/aad-pod-identity) is
configured) the micro-service will use AAD Pod Identity through the manifests
for
[azure-identity](./helm/ffc-demo-claim-service/templates/azure-identity.yaml)
and
[azure-identity-binding](./helm/ffc-demo-claim-service/templates/azure-identity-binding.yaml).

| Name                   | Description                                                                                |
| ----                   | -----------                                                                                |
| MESSAGE_QUEUE_HOST     | Azure Service Bus hostname, e.g. `myservicebus.servicebus.windows.net`                     |
| MESSAGE_QUEUE_PASSWORD | Azure Service Bus SAS policy key                                                           |
| MESSAGE_QUEUE_USER     | Azure Service Bus SAS policy name, e.g. `RootManageSharedAccessKey`                        |

## Environment variables

The following environment variables are required by the application container.
Values for development are set in the Docker Compose configuration. Default
values for production-like deployments are set in the Helm chart and may be
overridden by build and release pipelines.

| Name                           | Description                               | Required  | Default            | Valid                       | Notes                                                                             |
| ----                           | -----------                               | :-------: | -------            | -----                       | -----                                                                             |
| APPINSIGHTS_CLOUDROLE          | Role used for filtering metrics           | no        |                    |                             | Set to `ffc-demo-web-local` in docker compose files                               |
| APPINSIGHTS_INSTRUMENTATIONKEY | Key for application insight               | no        |                    |                             | App insights only enabled if key is present. Note: Silently fails for invalid key |
| CACHE_NAME                     | Cache name                                | no        | redisCache         |                             |                                                                                   |
| CLAIM_QUEUE_ADDRESS            | claim queue name                          | no        |                    | claim                       |                                                                                   |
| COOKIE_PASSWORD                | Redis cookie password                     | yes       |                    |                             |                                                                                   |
| NODE_ENV                       | Node environment                          | no        | development        | development,test,production |                                                                                   |
| OKTA_AUTH_SERVER_ID            | ID of Okta custom authorisation server    | no        |                    |                             |                                                                                   |
| OKTA_CLIENT_ID                 | Client ID of Okta OpenID Connect app      | no        |                    |                             |                                                                                   |
| OKTA_CLIENT_SECRET             | Client Secret of Okta OpenID Connect app  | no        |                    |                             |                                                                                   |
| OKTA_DOMAIN                    | Okta domain, i.e. `mysite.okta.com`       | no        |                    |                             |                                                                                   |
| OKTA_ENABLED                   | set to true to enable Okta authentication | no        | "true"             |                             |                                                                                   |
| PORT                           | Port number                               | no        | 3000               |                             |                                                                                   |
| REDIS_HOSTNAME                 | Redis host                                | no        | localhost          |                             |                                                                                   |
| REDIS_PORT                     | Redis port                                | no        | 6379               |                             |                                                                                   |
| REST_CLIENT_TIMEOUT_IN_MILLIS  | Rest client timout                        | no        | 5000               |                             |                                                                                   |
| SESSION_TIMEOUT_IN_MINUTES     | Redis session timeout                     | no        | 30                 |                             |                                                                                   |
| SITE_URL                       | URL of site, i.e. https://mysite.com      | no        |                    |                             |                                                                                   |
| STATIC_CACHE_TIMEOUT_IN_MILLIS | static file cache timeout                 | no        | 54000 (15 minutes) |                             |                                                                                   |

The `/account` page is accessible only by authenticated users. Authentication
uses either [Okta](https://www.okta.com/) or stubbed authentication (for local
development only). To use the stubbed authentication set `OKTA_ENABLED` to
`"false"`.

Okta specific environment variables must be set if `OKTA_ENABLED` is set to
`"true"`. A valid Okta OpenID Connect application is required, and the Okta
domain, client ID, Client Secret, Custom Authorisation Server ID, and URL of
the site must be set in the environment variables:
`OKTA_DOMAIN`, `OKTA_CLIENT_ID`, `OKTA_CLIENT_SECRET`, `OKTA_AUTH_SERVER_ID`,
and `SITE_URL` respectively.

Running the integration tests locally requires access to ASB, this can be
achieved by setting the following environment variables:
`MESSAGE_QUEUE_HOST`, `MESSAGE_QUEUE_PASSWORD`, `MESSAGE_QUEUE_USER`.
`CLAIM_QUEUE_ADDRESS` must be set to a valid, developer specific queue that is
available on ASB e.g. `ffc-demo-claim-<initials>` where `<initials>` are the
initials of the developer.

## Test structure

The tests have been structured into subfolders of ./test as per the
[Microservice test approach and repository structure](https://eaflood.atlassian.net/wiki/spaces/FPS/pages/1845396477/Microservice+test+approach+and+repository+structure)

## How to run tests

A convenience script is provided to run automated tests in a containerised
environment. This will rebuild images before running tests via docker-compose,
using a combination of `docker-compose.yaml` and `docker-compose.test.yaml`.
The command given to `docker-compose run` may be customised by passing
arguments to the test script.

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

A more convenient way to run tests in development is to use a file watcher to
automatically run tests each time associated files are modified. For this
purpose, the default docker-compose configuration mounts all app, test and git
files into the main `ffc-demo-web` container, enabling the test watcher to be
run as shown below. The same approach may be used to execute arbitrary commands
in the running app.

```
# Run unit test file watcher
docker-compose run ffc-demo-web npm run test:unit-watch

# Run all tests
docker-compose run ffc-demo-web npm test

# Open an interactive shell in the app container
docker-compose run ffc-demo-web sh
```

### Why the docker-compose.test.yaml exists

Given that tests can be run in the main ffc-demo-web container during
development, it may not be obvious why `docker-compose.test.yaml` exists. It's
main purpose is for CI pipelines, where tests need to run in a container
without any ports forwarded from the host machine.

### Running ZAP scan

A docker-compose exists for running a
[ZAP Baseline Scan](https://www.zaproxy.org/docs/docker/baseline-scan/).
Primarily this will be run during CI. It can also be run locally via the
[zap](./scripts/zap) script.

### Running Pa11y accessibility tests

A docker-compose exists for running a
[Pa11y-CI](https://github.com/pa11y/pa11y-ci).
Primarily this will be run during CI. It can also be run locally via the
[pa11y](./scripts/pa11y) script.

### Running acceptance tests

See [README](./test/acceptance/README.md).

## Running the application

The application is designed to run in containerised environments, using Docker
Compose in development and Kubernetes in production.

- A Helm chart is provided for production deployments to Kubernetes.

### Build container image

Container images are built using Docker Compose, with the same images used to
run the service with either Docker Compose or Kubernetes.

When using the Docker Compose files in development the local `app` folder will
be mounted on top of the `app` folder within the Docker container, hiding the
CSS files that were generated during the Docker build.  For the site to render
correctly locally `npm run build` must be run on the host system.


By default, the start script will build (or rebuild) images so there will
rarely be a need to build images manually. However, this can be achieved
through the Docker Compose
[build](https://docs.docker.com/compose/reference/build/) command:

```
# Build container images
docker-compose build
```

### Start and stop the service

Use Docker Compose to run service locally.

`docker-compose up`

Additional Docker Compose files are provided for scenarios such as linking to
other running services.

Link to other services:
```
docker-compose -f docker-compose.yaml -f docker-compose.override.yaml -f docker-compose.link.yaml up
```

### Test the service

This service posts messages to an ASB message queue. Manual testing
involves creating claims using the web UI and inspecting the appropriate
message queue. The service can be started by running
`docker-compose up --build` whilst having set the required
[environment variables](#azure-service-bus) for the ASB to be connected to.

The messages can be inspected with a tool such as
[Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer) or
the Service Bus Explorer, available within
[Azure Portal](https://azure.microsoft.com/en-us/updates/sesrvice-bus-explorer/).

An example message:
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

#### Accessing the pod

The service is exposed via a Kubernetes ingress, which requires an ingress
controller to be running on the cluster. For example, the NGINX Ingress
Controller may be installed via Helm:

```
# Install nginx-ingress into its own namespace
helm install --namespace nginx-ingress nginx-ingress
```

Alternatively, a local port may be forwarded to the pod:

```
# Forward local port to the Kubernetes deployment
kubectl port-forward --namespace=ffc-demo deployment/ffc-demo-web 3000:3000
```

Once the port is forwarded or an ingress controller is installed, the service
can be accessed and tested in the same way as described in the
[Test the service](#test-the-service) section above.

#### Probes

The service has both an Http readiness probe and an Http liveness probe
configured to receive at the below end points.

Readiness: `/healthy`
Liveness: `/healthz`

#### Basic Authentication

When deployed with an NGINX Ingress Controller, the ingress may be protected
with basic authentication by passing the `--auth` (or `-a`) flag to the
[Helm install](./scripts/helm/install) script. This relies on `htpasswd`, which
must be available on the host system, and will prompt for a username and
password.

```
# Deploy to the current Helm context with basic auth enabled
scripts/helm/install --auth
```

__How basic auth is configured__

Basic authentication is enabled via labels on the ingress object. Those labels
are read by the NGINX Ingress Controller and used to configure basic
authentication for incoming traffic. One of the labels provides the name of a
Kubernetes secret in which credentials are stored as the encoded output of a
`htpasswd` command. The ingress controller uses the value of that secret to
verify any basic auth attempt.

If it wasn't defined by the Helm chart, the secret could be created via the
following command:

```
# Create basic auth secret for username 'defra'
kubectl create secret generic ffc-demo-basic-auth2 --from-literal "auth=$(htpasswd -n defra)"
```

### Running without containers

The application may be run natively on the local operating if a Redis server is
available on `localhost:6379`. First build the application using:

`npm run build`

Now the application is ready to run:

`node app`

## Build Pipeline

The details of what is done during CI are best left to reviewing the
[Jenkinsfile](Jenkinsfile) as it changes over time, however, at a high level
the following happens:
- The application is validated
- The application is tested
- The application is built into deployable artifacts
- Those artifacts are deployed

A detailed description on the build pipeline and PR work flow is available in
the [Defra Confluence page](https://eaflood.atlassian.net/wiki/spaces/FFCPD/pages/1281359920/Build+Pipeline+and+PR+Workflow)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT
LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and
applications when using this information.

> Contains public sector information licensed under the Open Government license
> v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her
Majesty's Stationery Office (HMSO) to enable information providers in the
public sector to license the use and re-use of their information under a common
open licence.

It is designed to encourage use and re-use of information freely and flexibly,
with only a few conditions.
