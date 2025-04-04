FROM node:22-alpine3.20

WORKDIR /tiltify-frontend

ENV API_URL=http://localhost:3000

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD [ "node", "index.js" ]