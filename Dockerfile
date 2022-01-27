FROM node:17-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7072

CMD [ "npm", "run", "serve" ]
