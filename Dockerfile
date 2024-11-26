# Step 1: Use the official Node.js image as the base image
FROM node:20-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (or yarn.lock) files into the container
COPY package*.json ./

# Step 4: Install the dependencies in the container
RUN npm install --production

# Step 5: Copy the rest of the application code into the container
COPY . .

# Step 6: Build the NestJS application
RUN npm run build

# Step 7: Expose the port that the app will run on (default for NestJS is 3000)
EXPOSE 3000

# Step 8: Run the application
CMD ["npm", "run", "start:prod"]
