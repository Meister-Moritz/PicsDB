FROM node:20-alpine

WORKDIR /app

# Copy your existing package files to install your exact dependencies
COPY package*.json ./
RUN npm install
RUN npm install jwt-decode

# Link the rest of your existing React project files
COPY . .

EXPOSE 5173

# Starts your existing project using Vite's server mapped to the network
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
