# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files into the working directory
COPY package*.json ./

# Install dependencies, including devDependencies to perform a build
RUN npm install

# Copy the entire project directory into the container
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "start"]