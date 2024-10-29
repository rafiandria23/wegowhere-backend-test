# Base
FROM node:22-alpine AS base

# Development
FROM base AS development
ARG SVC
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/svc
COPY ./package.json ./yarn.lock ./
RUN yarn --frozen-lockfile
COPY ./ ./
RUN yarn build ${SVC}

# Production
FROM base AS production
ARG SVC
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/svc
COPY ./package.json ./yarn.lock ./
RUN yarn --production
COPY --from=development /usr/src/svc/dist ./dist

# Main File
ENV SVC_MAIN_FILE=./dist/apps/${SVC}/main
CMD node ${SVC_MAIN_FILE}
