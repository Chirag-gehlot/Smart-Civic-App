# Use official Node LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency files first (for layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy the rest of the source code
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]