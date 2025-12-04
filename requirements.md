Actúa como un Arquitecto de Software y Desarrollador Full Stack Senior. Quiero desarrollar una aplicación web de "Control de Fichajes" (Time Tracking) lista para producción y despliegue en DigitalOcean App Platform.

**OBJETIVO DEL PROYECTO**
Crear una aplicación monolítica (Frontend servido por Backend) dockerizada que permita a los empleados fichar y a los administradores gestionar tiempos y usuarios.

**STACK TECNOLÓGICO (Obligatorio)**
- **Frontend:** React (Vite) + Tailwind CSS (UI) + Recharts (Gráficos) + Axios.
- **Backend:** Node.js + Express.
- **Base de Datos:** PostgreSQL (Externa/Gestionada).
- **ORM:** Prisma (Para gestión de esquema y migraciones).
- **Despliegue:** Docker (Multi-stage build).

**REQUISITOS FUNCIONALES**

1. **Interfaz Pública (Kiosco):**
   - Pantalla principal con dos botones grandes: "ENTRADA" (Verde) y "SALIDA" (Rojo).
   - Al pulsar, modal pidiendo DNI.
   - **Lógica de Fichaje:**
     - Validar que el usuario existe.
     - Si es "Entrada": Registrar hora actual. Evitar doble entrada sin salida previa (opcional, o advertir).
     - Si es "Salida": Buscar el último registro de entrada abierto y cerrar la sesión calculando horas.
     - Feedback visual (Toast o Alerta): "Fichaje correcto: [Hora]" o Error.

2. **Panel de Administración (/admin):**
   - Protegido por contraseña (Login simple o JWT).
   - **Dashboard:**
     - Tarjetas con KPI: Empleados activos ahora, Total horas semana actual.
     - Gráfico de barras (Recharts): Horas trabajadas por día de la semana actual.
   - **Gestión de Usuarios (CRUD):**
     - Crear, Editar, Eliminar empleados (Campos: Nombre, DNI, Puesto).
   - **Auditoría:**
     - Tabla de fichajes con filtros (Fecha, Empleado).

**REQUISITOS TÉCNICOS (Production Ready)**

1. **Persistencia y Conexión:**
   - NO usar SQLite. Configurar Prisma para PostgreSQL.
   - La conexión a la DB debe ser vía variable de entorno `DATABASE_URL`.
   - Incluir un script `seed.js` para crear un usuario admin por defecto si no existe.

2. **Estructura del Servidor:**
   - El servidor Express debe tener las rutas de API (ej: `/api/users`, `/api/clock-in`) y, para cualquier otra ruta, servir los archivos estáticos del build de React (`dist/index.html`).

3. **Docker:**
   - Escribe un `Dockerfile` optimizado en dos etapas (Multi-stage):
     - Stage 1: Build del Frontend (Node + Vite build).
     - Stage 2: Setup del Backend, copia del `dist` del frontend, generación del cliente Prisma y arranque del servidor.

**ENTREGABLES SOLICITADOS**
1. Estructura de carpetas recomendada.
2. Archivo `schema.prisma` completo.
3. Archivo `server.js` (Backend) manejando API y archivos estáticos.
4. Componentes clave de React (Kiosco, Admin, Gráficos).
5. `Dockerfile` completo.
6. `docker-compose.yml` (opcional, para probar en local con un container de Postgres).

Por favor, asegúrate de que el código maneje errores gracefully (try/catch) y sea limpio.