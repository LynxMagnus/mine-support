[![Build Status](https://defradev.visualstudio.com/DEFRA_FutureFarming/_apis/build/status/DEFRA.mine-support?branchName=master)](https://defradev.visualstudio.com/DEFRA_FutureFarming/_build/latest?definitionId=579&branchName=master)

# Mine Support
Digital service mock to claim public money in the event property subsides into mine shaft.  This is the web front end for the application.  It contains a simple claim submission journey where user input data is cached in Redis.  On submission the data is pulled from Redis and passed to the API gateway.

# Environment variables
|Name|Description|Required|Default|Valid|Notes|
|---|---|:---:|---|---|---|
|NODE_ENV|Node environment|no|development|development,test,production||
|PORT|Port number|no|3000|||
|MINE_SUPPORT_CACHE_NAME|Cache name|no|redisCache|||
|REDIS_HOSTNAME|Redis host|no|localhost|||
|REDIS_PORT|Redis port|no|6379|||
|COOKIE_PASSWORD|Redis cookie password|yes||||
|MINE_SUPPORT_SESSION_TIMEOUT_IN_MINUTES|Redis session timeout|no|30|||
|MINE_SUPPORT_API_GATEWAY|Url of service API Gateway|no|http://localhost:3001|||
|MINE_SUPPORT_REST_CLIENT_TIMEOUT_IN_MILLIS|Rest client timout|no|5000|||

# Prerequisites
Node v10+
Redis 


# Running the application in Kubernetes
The service has been developed with the intention of running in Kubernetes.  A helm chart is included in the `.\helm` folder.

To get running against redis-ha locally you must deploy with no affinities, allow Redis nodes to reside on the same worker node, set the replicas to one, and set min slaves to zero. This can be done via the provided `redis.yaml` file using the command:

`helm install --namespace default --name redis -f redis.yaml stable/redis-ha`

Further information: https://stackoverflow.com/questions/55365775/redis-ha-helm-chart-error-noreplicas-not-enough-good-replicas-to-write

A Skaffold file is provided that will redeploy the application upon files changes. This can be run via the script `./bin/start-skaffold`.
Changes to the local file will be copied across to the pod, however this is fairly slow when running locally.
Skaffold uses a `dev-values.yaml` config that makes the file system in the container read/write and starts nodemon.

It is much quicker to use the provided docker-compose file for development. At the moment the compose file only contains the mine-support code and a Redis image, not stubs or images for other required services.

The docker-compose file can be launched via `./bin/start-compose`. This will start a nodemon session watching for changes in `.js` and `njk` files. 

For the volume mounts to work correct via WSL the application needs to be run from `/c/...` rather than `/mnt/c/..`.
You may need to create a directory at `/c` then mount it via `sudo mount --bind /mnt/c /c` to be able to change to `/c/..`

# Running the application outside of Containers
The application may be run natively on the local operating if a Redis server is available locally. First build the application using:

`$ npm run build`

Now the application is ready to run:

`$ node index.js`

# How to run tests
Unit tests are written in Lab and can be run with the following command:

`npm run test`

Alternatively the `docker-compose-test.yaml` used by the continuous integration build may be run via the script `./bin/test-compose`.

# Basic Authentication
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

 `./bin/build-image`

 export the generated auth token as the environment variable MINE_BASIC_AUTH, i.e.:

 `export MINE_BASIC_AUTH=xyzabc`

 deploy to the current Helm context

 `./bin/deploy-local`

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
