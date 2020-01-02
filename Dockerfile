# Base stage installs production dependencies
ARG REGISTRY=562955126301.dkr.ecr.eu-west-2.amazonaws.com
ARG BASE_VERSION=1.0.0
ARG DEV_VERSION=1.0.0
FROM $REGISTRY/ffc-node-base:$BASE_VERSION as base
ARG PORT=3000
ENV PORT ${PORT}
USER node
WORKDIR /home/node
COPY --chown=node:node package*.json ./
RUN npm ci

# Development stage installs devDependencies, builds app from source and declares a file watcher as the default command
FROM $REGISTRY/ffc-node-development:$DEV_VERSION AS development
EXPOSE ${PORT} 9229 9230
USER node
WORKDIR /home/node
COPY --from=base --chown=node:node /home/node/package*.json ./
COPY --from=base --chown=node:node /home/node/node_modules ./node_modules
RUN npm install
COPY --chown=node:node app/ ./app/
RUN npm run build
CMD [ "npm", "run", "start:watch" ]

# Test stage copied in Jest configuration and declares the test task as the default command
FROM development AS test
USER node
WORKDIR /home/node
COPY --chown=node:node jest.config.js ./jest.config.js
COPY --chown=node:node test/ ./test/
CMD [ "npm", "run", "test" ]

# Production stage exposes service port, copies in built app code and declares the Node app as the default command
FROM base AS production
USER node
WORKDIR /home/node
EXPOSE ${PORT}
COPY --from=development /home/node/app/ ./app/
CMD [ "node", "app/index" ]
