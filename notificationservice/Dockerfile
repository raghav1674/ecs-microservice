FROM node:16

WORKDIR /src/usr/app

COPY package.json .
COPY yarn.lock  . 

RUN yarn install 

COPY . .

CMD ["yarn","start"]
