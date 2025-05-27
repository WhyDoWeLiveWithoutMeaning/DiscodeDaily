# ---- Base Node ----
FROM node:20-slim AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm ci

# ---- Copy Files/Build ----
FROM dependencies AS build
WORKDIR /app
COPY . /app
RUN npm run build

# --- Final stage (we'll use nginx in docker-compose to serve these files) ----
FROM nginx:alpine AS release
# Copy built static files to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html
# We don't need to specify CMD as the nginx image already has it