# Build stage
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install -g @nestjs/cli && \
    npm install

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:dev"] 