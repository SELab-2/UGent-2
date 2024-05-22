FROM node:20 AS builder
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build
FROM nginx
RUN sed -E 's/(index  index.html) index.htm;/\1; try_files $uri \/index.html;/' -i /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
