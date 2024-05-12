FROM node:alpine AS BUILD_IMAGE
WORKDIR /app
COPY . .
RUN npm install
RUN npm run tsc

FROM node:21-alpine
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app
COPY --from=BUILD_IMAGE --chown=nodejs:nodejs /app/package.json /app/package-lock.json ./
COPY --from=BUILD_IMAGE --chown=nodejs:nodejs /app/build ./build

RUN NODE_ENV=$NODE_ENV npm install

USER nodejs
CMD ["npm", "run", "start:prod"]