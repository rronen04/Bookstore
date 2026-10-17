# Intentionally outdated base image (EOL Node 14 / old Alpine) to produce OS-level findings.
FROM node:14.17.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production --no-audit

COPY server.js ./
COPY views ./views

ENV PORT=8080
EXPOSE 8080

# Runs as root on purpose (misconfiguration finding)
CMD ["node", "server.js"]
