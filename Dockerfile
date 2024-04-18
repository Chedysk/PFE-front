
FROM nginx:alpine
COPY dist/ElearningManagement /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200
