FROM node:lts-alpine3.14

WORKDIR /Frontend/React/keep_my_receipt

COPY ./package.json /Frontend/React/keep_my_receipt

RUN npm install

COPY . /Frontend/React/keep_my_receipt

RUN npm run build

CMD ["npx", "serve", "-s", "build"]

EXPOSE 3000
