FROM node:24.11.1 AS base

ARG USERNAME=node
ARG SOURCES_PATH=/src
ARG APP_PATH=/app

FROM base AS deps-prod

COPY --chown=${USERNAME}:${USERNAME} ./package.json ./yarn.lock ${SOURCES_PATH}/

WORKDIR ${SOURCES_PATH}

RUN yarn install --production

FROM deps-prod AS deps-dev

RUN yarn install

FROM base AS build

COPY --chown=${USERNAME}:${USERNAME} . ${SOURCES_PATH}
COPY --from=deps-dev --chown=${USERNAME}:${USERNAME} \
    ${SOURCES_PATH}/node_modules ${SOURCES_PATH}/node_modules

WORKDIR ${SOURCES_PATH}

RUN yarn build:app

FROM base AS production

ENV NODE_OPTIONS=--use-openssl-ca

RUN mkdir ${APP_PATH} \
    && chown ${USERNAME}:${USERNAME} ${APP_PATH} \
    && chmod 700 ${APP_PATH}

COPY --from=deps-prod --chown=${USERNAME}:${USERNAME} \
    ${SOURCES_PATH}/node_modules ${APP_PATH}/node_modules
COPY --from=build --chown=${USERNAME}:${USERNAME} \
    ${SOURCES_PATH}/build/src ${APP_PATH}

WORKDIR ${APP_PATH}

EXPOSE 8080

USER ${USERNAME}

CMD ["node", "index.js"]

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

