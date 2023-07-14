FROM node:alpine
RUN apk add --no-cache gettext
RUN mkdir -p /code/tmp
COPY . /code
WORKDIR /code
RUN npm install --production

EXPOSE 8088
CMD ["npm", "start"]
