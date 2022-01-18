FROM node:14-alpine AS build

WORKDIR /code

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm install --loglevel warn --unsafe-perm

COPY . ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]