FROM node:14.16-buster-slim As deps
WORKDIR /app
COPY package.json  ./ 
RUN npm install

FROM node:14.16-buster-slim As builder
WORKDIR /app
COPY .  .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build


FROM node:14.16-buster-slim As runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build

EXPOSE 5000
CMD serve -s build



