# Use official Node.js image as base
FROM node:14

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire React app to the container
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Start React app
CMD ["npm", "start"]
