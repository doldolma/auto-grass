FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
ENV NODE_ENV=production
COPY . /app
EXPOSE 4000
CMD [ "node_modules/pm2/bin/pm2-runtime", "start", "app.js", "--name", "auto-grass" ]