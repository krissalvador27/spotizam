FROM node
RUN mkdir -p /usr/app/spotizam
COPY . /usr/app/spotizam
WORKDIR /usr/app/spotizam
EXPOSE 8080
CMD yarn serve-dev