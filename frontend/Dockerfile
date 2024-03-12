FROM node:20 AS builder
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build
FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
