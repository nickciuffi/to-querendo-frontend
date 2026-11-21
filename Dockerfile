# Build stage
FROM node:22-alpine AS build
WORKDIR /app

# Variáveis do Vite são embutidas no bundle em tempo de build,
# por isso entram como build args (e não como environment do container).
ARG VITE_API_URL
ARG VITE_MAPBOX_TOKEN
ENV VITE_API_URL=$VITE_API_URL \
    VITE_MAPBOX_TOKEN=$VITE_MAPBOX_TOKEN

# Limita a memória do Node no build — importante em EC2 com pouca RAM (ex.: t3.micro)
ENV NODE_OPTIONS=--max-old-space-size=768

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine
# Remove a config padrão; a nossa vem do template (gerado em /etc/nginx/conf.d/default.conf)
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx/templates/ /etc/nginx/templates/
COPY nginx/40-reload-certs.sh /docker-entrypoint.d/40-reload-certs.sh
# sed remove CRLF caso o arquivo tenha vindo do Windows
RUN sed -i 's/\r$//' /docker-entrypoint.d/40-reload-certs.sh && chmod +x /docker-entrypoint.d/40-reload-certs.sh
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80 443
