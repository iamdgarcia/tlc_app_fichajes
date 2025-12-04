#!/bin/bash

# Si la variable WAIT_FOR_DB está definida, espera a que la base de datos esté lista
if [ -n "$WAIT_FOR_DB" ]; then
  echo "Waiting for database at $WAIT_FOR_DB..."
  ./wait-for-it.sh "$WAIT_FOR_DB" -t 60 -- echo "Database is ready"
else
  echo "Skipping wait-for-it (WAIT_FOR_DB not set)"
fi

# Ejecutar comandos de la aplicación
echo "Starting application..."
cd backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
node src/server.js
