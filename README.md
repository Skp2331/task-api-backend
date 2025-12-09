# Task API Backend

A RESTful API built with **Nest.js** for managing tasks with user authentication and authorization.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![NestJS](https://img.shields.io/badge/NestJS-v10-red)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15-blue)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Testing](#testing)
- [Environment Variables](#environment-variables)

## ✨ Features

- **User Authentication** - Signup and login with JWT tokens
- **Task Management** - Full CRUD operations for tasks
- **Authorization** - Role-based access control (User/Admin)
- **Validation** - Request validation with class-validator
- **Error Handling** - Clean, consistent error responses
- **Database** - PostgreSQL with TypeORM
- **Docker** - Easy database setup with Docker Compose

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Nest.js | Backend framework |
| TypeORM | ORM for database |
| PostgreSQL | Database |
| JWT | Authentication |
| bcrypt | Password hashing |
| class-validator | DTO validation |
| Jest | Testing |
| Docker | Database container |

## 📁 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                 # Signup & Login DTOs
│   ├── guards/              # JWT & Role guards
│   ├── strategies/          # JWT strategy
│   ├── decorators/          # @GetUser, @Roles decorators
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
│
├── tasks/                   # Tasks module
│   ├── dto/                 # Create & Update DTOs
│   ├── entities/            # Task entity
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   └── tasks.module.ts
│
├── users/                   # Users module
│   ├── entities/            # User entity
│   ├── users.service.ts
│   └── users.module.ts
│
├── common/                  # Shared utilities
│   ├── enums/               # Role & TaskStatus enums
│   └── filters/             # Exception filters
│
├── app.module.ts            # Root module
└── main.ts                  # Entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Docker (for PostgreSQL)

### Installation

1. **Clone the repository**
   ```bash
   cd task-api-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env with your settings (optional)
   ```

4. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d
   ```

5. **Start the application**
   ```bash
   # Development mode (with hot reload)
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

6. **The API is now running at** `http://localhost:3000`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register a new user | No |
| POST | `/auth/login` | Login and get JWT token | No |

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/tasks` | Create a new task | Yes |
| GET | `/tasks` | Get all user's tasks | Yes |
| GET | `/tasks/:id` | Get a specific task | Yes |
| PATCH | `/tasks/:id` | Update a task | Yes |
| DELETE | `/tasks/:id` | Delete a task | Yes |

## 🔐 Authentication

This API uses **JWT (JSON Web Token)** for authentication.

### Signup

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Using the Token

Include the JWT token in the `Authorization` header:

```bash
curl http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Authorization

### Roles

| Role | Permissions |
|------|-------------|
| `user` | Can manage (CRUD) their own tasks only |
| `admin` | Can delete any user's task |

### Creating an Admin User

When signing up, you can specify the role:

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

## 📝 Request/Response Examples

### Create Task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the backend API"
  }'
```

**Response:**
```json
{
  "id": "task-uuid",
  "title": "Complete project",
  "description": "Finish the backend API",
  "status": "OPEN",
  "userId": "user-uuid",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Update Task Status

```bash
curl -X PATCH http://localhost:3000/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS"
  }'
```

**Task Status Values:** `OPEN`, `IN_PROGRESS`, `DONE`

### Delete Task

```bash
curl -X DELETE http://localhost:3000/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🧪 Testing

Run the unit tests:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

The project includes unit tests for:
- ✅ AuthService (signup, login, error cases)
- ✅ TasksService (CRUD operations, authorization)
- ✅ TasksController (all endpoints)

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_DATABASE` | Database name | `taskdb` |
| `JWT_SECRET` | Secret key for JWT | - |
| `JWT_EXPIRES_IN` | Token expiration time | `1d` |
| `PORT` | Application port | `3000` |

## 🐳 Docker

Start PostgreSQL:
```bash
docker-compose up -d
```

Stop PostgreSQL:
```bash
docker-compose down
```

Stop and remove data:
```bash
docker-compose down -v
```


