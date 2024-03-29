# FROM node:14.8.0
# COPY ./ /app
# WORKDIR /app
# RUN npm install && npm run build
 
FROM nginx
RUN mkdir /app
# COPY --from=0 /app/dist /app
COPY ./ui/dist /app
COPY ./docker/nginx.conf /etc/nginx/nginx.conf