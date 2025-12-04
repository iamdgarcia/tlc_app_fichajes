# --- Stage 1: Build Frontend ---
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --frozen-lockfile || npm install
COPY frontend .
RUN npm run build

# --- Stage 2: Backend + Serve Frontend ---
FROM node:20-alpine AS backend
WORKDIR /app
ENV NODE_ENV=production


# Dependencias del sistema necesarias para Prisma y PostgreSQL
RUN apk add --no-cache openssl libc6-compat

# Backend deps
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm install --omit=dev --frozen-lockfile || npm install --omit=dev

# Prisma schema and seed
COPY backend/prisma ./backend/prisma

# Copy backend src
COPY backend/src ./backend/src


# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist


# Descargar wait-for-it.sh para esperar a que Postgres esté listo
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh ./wait-for-it.sh
COPY backend/entrypoint.sh ./entrypoint.sh
RUN apk add --no-cache bash && chmod +x ./wait-for-it.sh ./entrypoint.sh

# CMD: Usar el script de entrada
CMD ["./entrypoint.sh"]

EXPOSE 3000
