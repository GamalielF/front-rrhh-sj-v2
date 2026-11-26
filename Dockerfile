# --- construcción ---
# Debian (no Alpine): las dependencias nativas de Angular (esbuild, lmdb, parcel) traen binarios para glibc
FROM node:24-bookworm-slim AS build
WORKDIR /app
# La misma versión de pnpm que declara package.json ("packageManager")
RUN npm install -g pnpm@12.15.0
COPY . .
RUN pnpm install --frozen-lockfile

# ENTORNO elige cuál de los archivos src/env/env.<ENTORNO>.ts usa la aplicación (no puede llamarse "test": el ejecutor de pruebas lo tomaría por una prueba). src/env/index.ts exporta siempre env.dev (o env.prod si
# alguien lo cambió); aquí se cambia esa línea SOLO dentro de la imagen, sin tocar el repositorio. Si el archivo no existe, la compilación falla.
ARG ENTORNO=pruebas
# Debe empezar y terminar con "/" y coincidir con PathPrefix de Traefik y con nginx.conf
ARG BASE_HREF=/roles-de-pago/
# DOMINIO: dominio público del servidor donde queda el front (y el backend, en la misma ruta del dominio).
# DOMINIO_AUTH: dominio donde responde /authenticator/. Vacío = el mismo DOMINIO (Traefik del servidor lo reenvía al autenticador).
# Se reemplaza el dominio escrito en env.<ENTORNO>.ts (pre-prod.coopsanjose.fin.ec): así un servidor nuevo no exige tocar el código.
ARG DOMINIO=pre-prod.coopsanjose.fin.ec
ARG DOMINIO_AUTH=
RUN F=projects/roles_de_pago_sj/src/env/env.${ENTORNO}.ts \
 && AUTH="${DOMINIO_AUTH:-$DOMINIO}" \
 && sed -i -e "s#https://pre-prod\.coopsanjose\.fin\.ec/authenticator/#@@AUTH@@#g" \
           -e "s#https://pre-prod\.coopsanjose\.fin\.ec/#https://${DOMINIO}/#g" \
           -e "s#@@AUTH@@#https://${AUTH}/authenticator/#g" "$F" \
 && echo "URL que usará el front:" && grep -o "https://[^']*" "$F" \
 && sed -i -E "s#'\./env\.(dev|prod)'#'./env.${ENTORNO}'#" projects/roles_de_pago_sj/src/env/index.ts \
 && grep -q "env.${ENTORNO}" projects/roles_de_pago_sj/src/env/index.ts \
 && pnpm exec ng build roles_de_pago_sj --configuration production --base-href "${BASE_HREF}"

# --- ejecución ---
# nginx que NO corre como root y escucha en 8080
FROM nginxinc/nginx-unprivileged:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/roles_de_pago_sj/browser/ /usr/share/nginx/html/roles-de-pago/
EXPOSE 8080
