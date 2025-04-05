FROM node:22-alpine3.20

# Set env variables
ENV DATABASE_URL=file:./tiltify.db
ENV TILTIFY_CLIENT_ID=placeholder
ENV TILTIFY_CLIENT_SECRET=placeholder
ENV TILTIFY_CAMPAIGN_ID=b49d29ef-6753-4cf0-93d1-b841ba268124

# Set the working directory inside the container
WORKDIR /tiltify-api

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Generate Prisma client
RUN npm run db:generate

# Build the thing
RUN npm run build

# Run DB migrations
RUN npm run db:migrate-deploy

# Expose the application port (change if your app uses a different port)
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "run", "start"]
