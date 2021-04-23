FROM node:14.16-buster-slim 
WORKDIR /app
RUN npm install -g serve
COPY ./package.json ./
RUN npm install
COPY .  .
RUN npm run build
EXPOSE 5000
CMD serve -s build



