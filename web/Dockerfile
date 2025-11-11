# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=21.4.0
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY . .

ENV NODE_ENV production
ENV DOCKER true
# Expose the port that the application listens on.
EXPOSE 3000 3001
