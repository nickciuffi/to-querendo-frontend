#!/bin/sh
# Emissão inicial do certificado HTTPS (rode UMA vez na EC2, de dentro desta pasta):
#   sh init-letsencrypt.sh
# Depois disso a renovação é automática (serviço certbot + reload do nginx).
#
# Pré-requisitos:
#   - registro DNS (A) de DOMAIN apontando para o IP da EC2
#   - portas 80 e 443 liberadas no Security Group
#   - backend já rodando (cria a rede toquerendo-net)
#   - .env preenchido (DOMAIN, ACME_EMAIL, VITE_API_URL, VITE_MAPBOX_TOKEN)
# Use STAGING=1 para testar sem gastar o limite de emissões do Let's Encrypt.
set -e

[ -f .env ] || { echo "Arquivo .env não encontrado"; exit 1; }
DOMAIN=$(grep -E '^DOMAIN=' .env | cut -d= -f2- | tr -d '\r')
ACME_EMAIL=$(grep -E '^ACME_EMAIL=' .env | cut -d= -f2- | tr -d '\r')
[ -n "$DOMAIN" ] || { echo "Defina DOMAIN no .env"; exit 1; }
[ -n "$ACME_EMAIL" ] || { echo "Defina ACME_EMAIL no .env"; exit 1; }

LIVE=./certbot/conf/live/$DOMAIN

if [ -f "$LIVE/fullchain.pem" ] && [ -z "$FORCE" ]; then
  echo "Já existe certificado para $DOMAIN. Use FORCE=1 para emitir de novo."
  exit 0
fi

# Certificado autoassinado só para o nginx conseguir subir (ele exige um certificado no 443)
create_dummy_cert() {
  mkdir -p "$LIVE" ./certbot/www
  docker compose run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
      -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
      -out /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
      -subj /CN=localhost" certbot
}

echo "### Criando certificado provisório para $DOMAIN (para o nginx conseguir subir)..."
create_dummy_cert

echo "### Subindo o nginx..."
docker compose up -d --build web

echo "### Removendo certificado provisório..."
docker compose run --rm --entrypoint "\
  rm -rf /etc/letsencrypt/live/$DOMAIN \
         /etc/letsencrypt/archive/$DOMAIN \
         /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

STAGING_ARG=""
[ "$STAGING" = "1" ] && STAGING_ARG="--staging"

echo "### Solicitando certificado do Let's Encrypt para $DOMAIN..."
if ! docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $STAGING_ARG \
    -d $DOMAIN \
    --email $ACME_EMAIL \
    --rsa-key-size 4096 \
    --agree-tos --no-eff-email \
    --force-renewal" certbot; then
  echo "### Falha ao emitir o certificado. Recriando o provisório para o nginx continuar funcionando."
  echo "### Confira o DNS de $DOMAIN (deve apontar para esta máquina) e as portas 80/443 no Security Group."
  create_dummy_cert
  exit 1
fi

echo "### Recarregando o nginx..."
docker compose exec web nginx -s reload

echo "### Subindo o certbot (renovação automática)..."
docker compose up -d certbot

echo "Pronto: https://$DOMAIN"
