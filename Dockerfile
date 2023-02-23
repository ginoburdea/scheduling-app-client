FROM node:17-alpine AS build-stage
WORKDIR /scheduling-app
COPY . .
RUN npm install

ENV NODE_ENV=production
ARG VITE_SERVER_URL
ARG VITE_ENCRYPTION_KEY
ARG CLIENT_PORT
RUN npm run build

FROM nginx:stable-alpine
COPY certificates /certificates
COPY --from=build-stage /scheduling-app/dist /scheduling-app
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
