#!/bin/sh
# Executado pelo entrypoint da imagem do nginx antes de subir o servidor.
# Recarrega o nginx a cada 6h para aplicar certificados renovados pelo certbot.
(
  while :; do
    sleep 6h
    nginx -s reload
  done
) &
