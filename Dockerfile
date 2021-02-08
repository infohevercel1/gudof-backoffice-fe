FROM node:12-alpine


RUN npm install -g serve
RUN mkdir -p /deploy/build
WORKDIR ./deploy
COPY ./build ./build
EXPOSE 3000
CMD serve -l 3000 -s build