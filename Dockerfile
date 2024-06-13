FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Move static files to the desired location
#RUN mkdir -p build/app/eut_research_infrastructure/static && \
#    mv build/static/* build/app/eut_research_infrastructure/static && \
#    rm -rf build/static

# Install serve to serve the build
RUN npm install -g serve

# Serve the build folder
CMD ["serve", "-s", "build", "-l", "3000"]

EXPOSE 3000
