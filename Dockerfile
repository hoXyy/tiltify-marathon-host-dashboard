FROM node:22-alpine3.20

# Set env variables
ENV DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/postgres
ENV TILTIFY_CLIENT_ID=placeholder
ENV TILTIFY_CLIENT_SECRET=placeholder
ENV TILTIFY_CAMPAIGN_ID=placeholder

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

# Expose the application port
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "run", "start"]
