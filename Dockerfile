ARG PARENT_VERSION=1.0.0-node10.19.0
ARG PORT=3000
ARG REGISTRY=562955126301.dkr.ecr.eu-west-2.amazonaws.com

# Development
FROM ${REGISTRY}/ffc-node-development:${PARENT_VERSION} AS development
ARG PARENT_VERSION
ARG REGISTRY
LABEL uk.gov.defra.ffc.parent-image=${REGISTRY}/ffc-node-development:${PARENT_VERSION}
ARG PORT
ENV PORT ${PORT}
EXPOSE ${PORT} 9229 9230
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node app/ ./app/
RUN npm run build
CMD [ "npm", "run", "start:watch" ]

# Production
FROM ${REGISTRY}/ffc-node:${PARENT_VERSION} AS production
ARG PARENT_VERSION
ARG REGISTRY
LABEL uk.gov.defra.ffc.parent-image=${REGISTRY}/ffc-node:${PARENT_VERSION}
ARG PORT
ENV PORT ${PORT}
EXPOSE ${PORT}
COPY --from=development /home/node/app/ /home/node/app/
COPY --from=development /home/node/package*.json /home/node/
RUN npm ci
CMD [ "node", "app" ]
