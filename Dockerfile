# syntax=docker/dockerfile:experimental

# ---- Base Node ----
FROM node:16-alpine AS base
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm config set ignore-scripts true
WORKDIR /data
RUN mkdir -p /home/node/.npm
RUN chown -R node:node /data && chown -R node:node /home/node/.npm
RUN --mount=type=cache,uid=1000,gid=1000,target=/home/node/.npm \
    npm install --global --no-audit npm
COPY --chown=node:node .npmrc ./
COPY --chown=node:node package.json ./

FROM base AS dependencies-update
RUN --mount=type=cache,uid=1000,gid=1000,target=/home/node/.npm \
    npm install --global --no-audit npm-check-updates
RUN ncu -u  

FROM base AS dependencies
RUN --mount=type=cache,uid=1000,gid=1000,target=/home/node/.npm \
    npm install --force --no-audit

FROM base AS publish
ARG NPM_TOKEN
RUN npm config set git-tag-version false && \
    npm config set commit-hooks false
COPY --chown=node:node . ./
RUN npm version patch
RUN npm publish

# ---- Test/Cover ----
FROM dependencies AS test
USER node
COPY --chown=node:node wait /wait
RUN chmod +x /wait
COPY --chown=node:node . ./
CMD ["sh", "-c", "/wait && npm run coverage"]