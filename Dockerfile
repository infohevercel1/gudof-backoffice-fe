FROM node:14.16-buster-slim
RUN npm install -g serve
RUN mkdir -p /deploy/build
WORKDIR ./deploy 
COPY ./build ./build
EXPOSE 3000
CMD serve -s build