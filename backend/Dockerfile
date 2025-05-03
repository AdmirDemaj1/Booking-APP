# Use a Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the backend port
EXPOSE 3000

# Default command
CMD ["npm", "run", "start:dev"]
