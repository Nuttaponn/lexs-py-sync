FROM harbor.devopsnonprd.vayuktbcs/lexs/node:22.11.0-alpine AS builder

ARG PROJECT=lexs
ARG ENV=dev

WORKDIR /usr/src/app
COPY package.json ./
COPY .npmrc ./
RUN npm -loglevel info install --legacy-peer-deps -strict-ssl false
COPY . .
RUN ./node_modules/.bin/ng build ${PROJECT} --configuration ${ENV}

### STAGE 2: Run ###
FROM harbor.devopsnonprd.vayuktbcs/lexs/nginx:1.21.6
EXPOSE 80
ARG PROJECT=lexs

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /usr/src/app/dist/${PROJECT}/browser /usr/share/nginx/html
COPY nginx/40x.html /usr/share/nginx/html
COPY nginx/50x.html /usr/share/nginx/html


CMD ["nginx", "-g", "daemon off;"]
