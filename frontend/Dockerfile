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

