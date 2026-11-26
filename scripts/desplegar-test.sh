#!/usr/bin/env bash
# =====================================================================================================
# Despliegue MANUAL del front de SIRPA en el servidor de PRUEBAS (no es producción).
#
# Uso, en el servidor, desde la carpeta del repositorio ya actualizada (git pull):
#     DOMINIO=<dominio-del-servidor-de-pruebas> ./scripts/desplegar-test.sh
#
# Variables (solo DOMINIO es obligatoria):
#   DOMINIO        dominio público del servidor de pruebas, sin https:// (ej. sirpa-test.coopsanjose.fin.ec)
#   DOMINIO_AUTH   dónde está el login (/authenticator). Por defecto pre-prod.coopsanjose.fin.ec
#   RUTA           ruta pública del front. Por defecto /roles-de-pago (debe coincidir con nginx.conf)
#   RED            red de Docker del proxy (Traefik). Por defecto proxy-network
#   PUERTO         opcional: publica el front en ese puerto del servidor, si el proxy de TI no es Traefik
#
# Si la construcción falla, el contenedor que estaba funcionando NO se toca.
# =====================================================================================================
set -euo pipefail

: "${DOMINIO:?Falta DOMINIO. Ejemplo: DOMINIO=sirpa-test.coopsanjose.fin.ec ./scripts/desplegar-test.sh}"
DOMINIO_AUTH="${DOMINIO_AUTH:-pre-prod.coopsanjose.fin.ec}"
RUTA="${RUTA:-/roles-de-pago}"
RED="${RED:-proxy-network}"
PUERTO="${PUERTO:-}"
SERVICIO="rrhh-roll-administration-front"
CONTENEDOR="test-$SERVICIO-app"
IMAGEN="app/$SERVICIO:test"

cd "$(dirname "$0")/.."

docker network inspect "$RED" >/dev/null 2>&1 || { echo "ERROR: no existe la red de Docker '$RED' (pida a TI crearla o indique RED=...)"; exit 1; }

echo "== 1/3 Construyendo la imagen (front en https://$DOMINIO$RUTA/, login en https://$DOMINIO_AUTH/authenticator/)"
docker build \
  --build-arg ENTORNO=pruebas \
  --build-arg BASE_HREF="$RUTA/" \
  --build-arg DOMINIO="$DOMINIO" \
  --build-arg DOMINIO_AUTH="$DOMINIO_AUTH" \
  -t "$IMAGEN" .

echo "== 2/3 Reemplazando el contenedor $CONTENEDOR"
docker rm -f "$CONTENEDOR" >/dev/null 2>&1 || true
docker run -d \
  --name "$CONTENEDOR" \
  --restart always \
  --network "$RED" \
  ${PUERTO:+-p "$PUERTO:8080"} \
  --label "traefik.enable=true" \
  --label "traefik.http.routers.$CONTENEDOR.rule=Host(\`$DOMINIO\`) && PathPrefix(\`$RUTA\`)" \
  --label "traefik.http.routers.$CONTENEDOR.entrypoints=websecure" \
  --label "traefik.http.routers.$CONTENEDOR.tls=true" \
  --label "traefik.http.services.$CONTENEDOR.loadbalancer.server.port=8080" \
  "$IMAGEN" >/dev/null

echo "== 3/3 Comprobando"
sleep 3
if docker exec "$CONTENEDOR" wget -qO- http://127.0.0.1:8080/healthz >/dev/null 2>&1; then
  echo "OK: el front responde. Abra https://$DOMINIO$RUTA/ (debe mostrar el login)"
else
  echo "ERROR: el front no responde. Registros:"; docker logs --tail 30 "$CONTENEDOR"; exit 1
fi
docker image prune -f >/dev/null
