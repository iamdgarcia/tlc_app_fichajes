# Control de Fichajes (Time Tracking Application)

A production-ready time tracking application for employee clock-in/clock-out management. Built with React, Node.js, Express, PostgreSQL, and Prisma. Fully dockerized and ready for deployment on DigitalOcean App Platform.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Local Development](#local-development)
  - [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Deployment](#deployment)
- [License](#license)

## Features

### Public Kiosk Interface
- Large, accessible buttons for "ENTRADA" (Clock In) and "SALIDA" (Clock Out)
- DNI-based employee identification via modal popup
- Visual feedback for successful/failed clock operations
- Dark/Light mode toggle
- Responsive design with glassmorphism UI

### Administration Panel (`/admin`)
- Password-protected access with JWT authentication
- **Dashboard**: Real-time KPIs including active employees and weekly hours
- **User Management (CRUD)**: Create, edit, and delete employees (Name, DNI, Position)
- **Audit Log**: Filterable table of all clock-in/clock-out records

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Charts | Recharts |
| HTTP Client | Axios |
| Backend | Node.js + Express |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| Authentication | JWT + bcryptjs |
| Containerization | Docker (Multi-stage build) |

## Project Structure

```
tlc_app_fichajes/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed.js            # Initial data seeding
│   │   └── migrations/        # Database migrations
│   ├── src/
│   │   ├── server.js          # Express server entry point
│   │   ├── controllers/       # Business logic
│   │   ├── middlewares/       # Auth and other middleware
│   │   ├── routes/            # API route definitions
│   │   │   ├── admin.js       # Admin endpoints
│   │   │   ├── clocking.js    # Clock-in/out endpoints
│   │   │   └── users.js       # User management endpoints
│   │   └── utils/             # Utility functions
│   ├── entrypoint.sh          # Docker entrypoint script
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   ├── index.css          # Global styles + Tailwind
│   │   ├── components/
│   │   │   ├── Admin/         # Admin dashboard components
│   │   │   ├── Charts/        # Recharts visualizations
│   │   │   ├── Kiosk/         # Kiosk interface
│   │   │   └── ThemeToggle.jsx
│   │   └── pages/
│   │       ├── KioskPage.jsx
│   │       ├── AdminPage.jsx
│   │       └── LoginPage.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml         # Local development with PostgreSQL
├── Dockerfile                 # Multi-stage production build
└── README.md
```

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Docker** & **Docker Compose** (for containerized deployment)
- **PostgreSQL** 16 (or use Docker)

## Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamdgarcia/tlc_app_fichajes.git
   cd tlc_app_fichajes
   ```

2. **Set up the database**
   
   Start PostgreSQL using Docker:
   ```bash
   docker compose up db -d
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL=postgres://fichajes:fichajes@localhost:5432/fichajes
   JWT_SECRET=your-super-secret-key
   PORT=3000
   ```

4. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

5. **Run database migrations and seed**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   npm run seed
   ```

6. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

7. **Start development servers**
   
   Backend (from `backend/` directory):
   ```bash
   npm run dev
   ```
   
   Frontend (from `frontend/` directory):
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Docker Deployment

Build and run the entire stack with Docker Compose:

```bash
docker compose up --build
```

The application will be available at http://localhost:3000

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT token signing | Required |
| `PORT` | Server port | `3000` |
| `WAIT_FOR_DB` | Host:port to wait for (Docker) | - |

## Database Schema

### User
| Field | Type | Description |
|-------|------|-------------|
| `id` | Int | Primary key |
| `name` | String | Employee name |
| `dni` | String | Unique identifier (National ID) |
| `position` | String | Job position |
| `role` | Enum | `ADMIN` or `EMPLOYEE` |
| `password` | String | Hashed password |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

### Clocking
| Field | Type | Description |
|-------|------|-------------|
| `id` | Int | Primary key |
| `userId` | Int | Foreign key to User |
| `type` | Enum | `ENTRADA` or `SALIDA` |
| `timeIn` | DateTime | Clock-in timestamp |
| `timeOut` | DateTime? | Clock-out timestamp (nullable) |
| `createdAt` | DateTime | Creation timestamp |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Clocking
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/clocking` | Register clock-in/out |
| GET | `/api/clocking` | Get clocking records (with filters) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard KPIs |
| GET | `/api/admin/audit` | Audit log with filters |

## Usage

### Kiosk Mode (Employee Clock-In/Out)

1. Navigate to the root URL (`/`)
2. Click "ENTRADA" to clock in or "SALIDA" to clock out
3. Enter your DNI in the popup modal
4. Click "Confirmar" to register the action

### Admin Panel

1. Navigate to `/login`
2. Enter admin credentials
3. Access the dashboard at `/admin`
4. Use the sidebar to navigate between Dashboard, Users, and Audit sections

### Default Admin Credentials

After running the seed script, use:
- **DNI**: `admin`
- **Password**: `admin123`

(Change these in production)

## Deployment

### DigitalOcean App Platform

1. Push your code to a GitHub repository
2. Create a new App in DigitalOcean App Platform
3. Connect your repository
4. Configure environment variables:
   - `DATABASE_URL`: Your managed PostgreSQL connection string
   - `JWT_SECRET`: A secure random string
5. Deploy

### Manual Docker Deployment

```bash
# Build the image
docker build -t tlc-fichajes .

# Run with environment variables
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgres://user:pass@host:5432/db" \
  -e JWT_SECRET="your-secret" \
  tlc-fichajes
```

## Scripts

### Backend
| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run migrate` | Run Prisma migrations |
| `npm run generate` | Generate Prisma client |
| `npm run seed` | Seed database with initial data |

### Frontend
| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## License

MIT License - See [LICENSE](LICENSE) for details.

---

Developed by [iamdgarcia](https://github.com/iamdgarcia)
