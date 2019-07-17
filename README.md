[![Build Status](https://defradev.visualstudio.com/DEFRA_FutureFarming/_apis/build/status/DEFRA.mine-support?branchName=develop)](https://defradev.visualstudio.com/DEFRA_FutureFarming/_build/latest?definitionId=579&branchName=develop)

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

# Running the application
First build the application using:

`$ npm run build`

Now the application is ready to run:

`$ node index.js`

Alternatively the project can be run in a container through the docker-compose.yaml file.

# Kubernetes
The service has been developed with the intention of running in Kubernetes.  A helm chart is included in the `.\helm` folder.

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



# Note on running in local Kubernetes cluster
To get running against redis-ha locally you must deploy with no affinities, so redis nodes can be on same worker node, set the replicas to one, and set min slaves to zero. This can be donw via the provided `redis.yaml` file:

`helm install --namespace default --name redis -f redis.yaml stable/redis-ha`

Further information: https://stackoverflow.com/questions/55365775/redis-ha-helm-chart-error-noreplicas-not-enough-good-replicas-to-write

A Skaffold file is provided that can redeploy files upon change. This can be run via the script `./bin/start-skaffold`.
Changes to the local file will be copied across to the pod, however this is fairly slow when running locally.
Skaffold uses a `dev-values.yaml` config that makes the file system in the container read/write and starts nodemon.

It's about an order of magnitude quicker to use the provided docker-compose file. At the moment this only contains the local code and a Redis image, not stubs or images for other required services.

The docker-compose file can be launched via `./bin/start-compose`. This will start a nodemon session watching for changes in `.js` and `njk` files. 

For the volume mounts to work correct via WSL the application needs to be run from `/c/...` rather than `/mnt/c/..`.
You may need to create a directory at `/c` then mount it via `sudo mount --bind /mnt/c /c` to be able to change to `/c/..`

# How to run tests
Unit tests are written in Lab and can be run with the following command:

`npm run test`
