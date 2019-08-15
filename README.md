[![Build Status](https://defradev.visualstudio.com/DEFRA_FutureFarming/_apis/build/status/DEFRA.mine-support?branchName=master)](https://defradev.visualstudio.com/DEFRA_FutureFarming/_build/latest?definitionId=579&branchName=master)

# Mine Support

Digital service mock to claim public money in the event property subsides into mine shaft.  This is the web front end for the application.  It contains a simple claim submission journey where user input data is cached in Redis.  On submission the data is pulled from Redis and passed to the API gateway.

# Environment variables

| Name                                  | Description                | Required | Default               | Valid                       |
|---------------------------------------|----------------------------|:--------:|-----------------------|-----------------------------|
| NODE_ENV                              | Node environment           | no       | development           | development,test,production |
| PORT                                  | Port number                | no       | 3000                  |                             |
| MINE_SUPPORT_CACHE_NAME               | Cache name                 | no       | redisCache            |                             |
| REDIS_HOSTNAME                        | Redis host                 | no       | localhost             |                             |
| REDIS_PORT                            | Redis port                 | no       | 6379                  |                             |
| COOKIE_PASSWORD                       | Redis cookie password      | yes      |                       |                             |
| MINE_SUPPORT_API_GATEWAY              | Url of service API Gateway | no       | http://localhost:3001 |                             |
| MINE_SUPPORT_SESSION_TIMEOUT_IN_MINUTES    | Redis session timeout | no       | 30                    |                             |
| MINE_SUPPORT_REST_CLIENT_TIMEOUT_IN_MILLIS | Rest client timout    | no       | 5000                  |                             |

# Prerequisites

- Node v10+
- Access to a Redis server

# How to run tests

A convenience script is provided to run automated tests in a containerised environment:

```
scripts/test
```

This runs tests via a `docker-compose run` command. If tests complete successfully, all containers, networks and volumes are cleaned up before the script exits. If there is an error or any tests fail, the associated Docker resources will be left available for inspection.

Alternatively, the same tests may be run locally via npm:

```
npm run test
```

# Running the application

The application is designed to run as a container via Docker Compose or Kubernetes (with Helm).

## Using Docker Compose

A set of convenience scripts are provided for local development and running via Docker Compose.

```
# Build service containers
scripts/build

# Start the service and attach to running containers (press `ctrl + c` to quit)
scripts/start

# Stop the service and remove Docker volumes and networks created by the start script
scripts/stop
```

Any arguments provided to the build and start scripts are passed to the Docker Compose `build` and `up` commands, respectively. For example:

```
# Build without using the Docker cache
scripts/build --no-cache

# Start the service without attaching to containers
scripts/start --detach
```

This service depends on an external Docker network named `mine-support` to communicate with other Mine Support services running alongside it. The start script will automatically create the network if it doesn't exist and the stop script will remove the network if no other containers are using it.

The external network is declared in a secondary Docker Compose configuration (referenced by the above scripts) so that this service can be run in isolation without creating an external Docker network by using standard Docker Compose commands:

```
# Build containers
docker-compose build

# Start the service is isolation
docker-compose up
```

### Volume mounts on Windows Subsystem for Linux

For the volume mounts to work correct via WSL it is necessary to either set up automounting of `/mnt/c`, or change the mount point for the shared drive from `/mnt/c` to `/c`. For a well-explained write-up, see [this blog post](https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly) by Nick Janetakis.

## Using Kubernetes

The service has been developed with the intention of running on Kubernetes in production.  A helm chart is included in the `.\helm` folder. For development, it is simpler to develop using Docker Compose than to set up a local Kubernetes environment. See above for instructions.

Running via Helm requires a Redis instance to be installed in the local Kubernetes cluster, which may be accomplished using the provided [`redis.yaml`](./redis.yaml) file.

`helm install --namespace default --name redis -f redis.yaml stable/redis-ha`

This will deploy a single Redis instance with no affinities, allowing Redis nodes to reside on the same worker node, and no minimum slaves requirement. For information on the minimum slaves setting, see [this post](https://stackoverflow.com/questions/55365775/redis-ha-helm-chart-error-noreplicas-not-enough-good-replicas-to-write) on Stack Overflow.

As an alternative to Docker Compose, a Skaffold file is provided that will automatically redeploy the application to Kubernetes upon files changes. This can be run via the script `./scripts/start-skaffold`. Changes to the local file will be copied across to the pod, however this is fairly slow compared to Docker Compose with bind-mounts. Skaffold uses a `dev-values.yaml` config that makes the container file read/write and starts the application using nodemon.

### Basic Authentication

The ingress controller may be protected with basic authentication by setting the `auth` value exposed by [values.yaml](./helm/values.yaml) on deployment.

The provided auth string must be an htpasswd encoded for use in the data field of a Kubernetes secret.

To generate the correct format auth token first create a username and password using htpasswd.
Below shows creating a password for the user 'defra'.

`htpasswd -c ./auth defra`

Upon hitting return you will be prompted to enter a password for the user.
A Secret can then be created in Kubernetes directly from the `./auth` file:

`kubectl create secret generic basic-auth --namespace default --from-file auth`

The secret can be viewed with the command:

`kubectl get secret basic-auth -o yaml`

The encoded, encrypted, username and password will be shown in the auth field of the data section.

```
apiVersion: v1
data:
  auth: xyzabc
kind: Secret
metadata:
...
```
In the example above the value of `auth` would be need to be set to `xyzabc` to use the generated credentials.

Setting the new auth value while deploying the Helm chart will prompt a user to enter the username and password when visiting the web site.

A utility script is provided to aid in deploying locally using basic authentication.

First build the container

 `./scripts/build`

 export the generated auth token as the environment variable MINE_BASIC_AUTH, i.e.:

 `export MINE_BASIC_AUTH=xyzabc`

 deploy to the current Helm context

 `./scripts/deploy`

## Running without containers

The application may be run natively on the local operating if a Redis server is available on `localhost:6379`. First build the application using:

`$ npm run build`

Now the application is ready to run:

`$ node index.js`

# Build Pipeline

The [azure-pipelines.yaml](azure-pipelines.yaml) performs the following tasks:
- Runs unit tests
- Publishes test result
- Pushes containers to the registry tagged with the PR number or release version
- Deploys PRs to a temporary end point for review
- Deletes PR deployments, containers, and namepace upon merge

Builds will be deployed into a namespace with the format `mine-support-{identifier}` where `{identifier}` is either the release version, the PR number, or the branch name.

The builds will be available at the URL `http://mine-support-{identifier}.{ingress-server}`, where `{ingress-server}` is the ingress server defined the [`values.yaml`](./helm/values.yaml),  which is `defradev.com` by default.

The temporary deployment requires a CNAME subdomain wildcard pointing to the public IP address of the ingress controller of the Kubernetes cluster. This can be simulated by updating your local `hosts` file with an entry for the build address set to the ingress controller's public IP address. On windows this would mean adding a line to `C:\Windows\System32\drivers\etc\hosts`, i.e. for PR 8 against the default ingress server this would be

xx.xx.xx.xx mine-support-pr8.defradev.com

where `xx.xx.xx.xx` is the public IP Address of the Ingress Controller.

A detailed description on the build pipeline and PR work flow is available in the [Defra Confluence page](https://eaflood.atlassian.net/wiki/spaces/FFCPD/pages/1281359920/Build+Pipeline+and+PR+Workflow)
