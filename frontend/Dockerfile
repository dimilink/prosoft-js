FROM node:24.11.1 AS base

ARG USERNAME=node
ARG SOURCES_PATH=/src
ARG APP_PATH=/app

FROM base AS development

USER root
WORKDIR ${SOURCES_PATH}

COPY --chown=root:root --chmod=500 <<EOF /docker-entrypoint.sh
#!/usr/bin/env bash
set -eo pipefail
yarn install --frozen-lockfile
exec yarn dev
EOF

VOLUME ["${SOURCES_PATH}"]
EXPOSE 8080
ENTRYPOINT ["/docker-entrypoint.sh"]

FROM base AS build

ARG USERNAME=node
ARG SOURCES_PATH=/src

WORKDIR ${SOURCES_PATH}

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM base AS production

ARG USERNAME=node
ARG APP_PATH=/app

WORKDIR ${APP_PATH}

COPY --from=build --chown=${USERNAME}:${USERNAME} ${SOURCES_PATH}/package.json ./
COPY --from=build --chown=${USERNAME}:${USERNAME} ${SOURCES_PATH}/node_modules ./node_modules

COPY --from=build --chown=${USERNAME}:${USERNAME} ${SOURCES_PATH}/dist ./dist

EXPOSE 8080
USER ${USERNAME}

CMD ["npx", "vite", "preview", "--port", "8080", "--host", "0.0.0.0"]

