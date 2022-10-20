# Build
FROM node:16 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Run
FROM node:16-alpine
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm","run","start:prod"]