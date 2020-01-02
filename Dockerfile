# Base stage installs production dependencies
FROM node:10.15.3-alpine AS base
ARG PORT=3000
ENV PORT ${PORT}
USER node
WORKDIR /home/node
COPY --chown=node:node package*.json ./
RUN npm ci

# Development stage installs devDependencies, builds app from source and declares a file watcher as the default command
FROM base AS development
EXPOSE ${PORT} 9229 9230
RUN npm install
COPY --chown=node:node app/ /home/node/app/
RUN npm run build
CMD [ "npm", "run", "start:watch" ]

# Test stage copied in Jest configuration and declares the test task as the default command
FROM development AS test
COPY --chown=node:node jest.config.js /home/node/jest.config.js
CMD [ "npm", "run", "test" ]

# Production stage exposes service port, copies in built app code and declares the Node app as the default command
FROM base AS production
EXPOSE ${PORT}
COPY --from=development /home/node/app/ /home/node/app/
CMD [ "node", "app/index" ]
