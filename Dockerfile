FROM node:8-alpine
LABEL maintainer = "fejes.mark92@gmail.com"
WORKDIR opt/backend
COPY package.json package-lock.json ./

RUN apk update
RUN apk add --no-cache make gcc g++ python git
RUN apk --no-cache --update add postgresql-client

RUN npm install
COPY . ./
EXPOSE 7000
CMD npm run start:dev
