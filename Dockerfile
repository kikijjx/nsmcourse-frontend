FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN rm -rf node_modules && rm -f package-lock.json

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]
