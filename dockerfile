# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the app
RUN npm run build

# ---- Run Stage ----
FROM node:20-alpine

WORKDIR /app

# Install serve globally to serve the built app
RUN npm install -g serve

# Copy the built files from builder
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 3000

# Serve the dist folder
CMD ["serve", "-s", "dist", "-l", "3000"]
