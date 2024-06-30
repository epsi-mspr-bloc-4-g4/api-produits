# BASE IMAGE
FROM node:lts-alpine3.20
LABEL org.opencontainers.image.description "A simple Node.js Product API for PayeTonKawa company using Express.js and Prisma ORM"

# COPY FILES
COPY ./src /app
COPY ./prisma /app/prisma
COPY ./package.json /app/package.json

WORKDIR /app

# Install dependencies
RUN npm install --omit=dev

# RUN APP
CMD ["node", "app.ts"]

EXPOSE 3000

RUN chmod +x /app/entrypoint.sh

# Set the entrypoint to the entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]