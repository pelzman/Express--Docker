FROM node:18.16.0
WORKDIR  /book
COPY package.json /book
RUN yarn install
COPY . /book
EXPOSE 5000
CMD ["yarn", "start"]


