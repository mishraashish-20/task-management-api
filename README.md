# Task Management API (Interview Submission)

A production-style REST API for managing tasks with **multiple users**, **RBAC (Admin/Manager/User)**, **JWT auth**, **file attachments**, and **email notifications**.

- **Swagger UI:** `http://localhost:3000/api/docs`
- **Base URL:** `http://localhost:3000/api`
- **Health:** `GET /health`

---

## Tech Stack

- **Node.js + Express.js** (REST API)
- **JWT** (auth) + **bcrypt** (password hashing)
- **MySQL + Sequelize** (users, roles, teams)
- **MongoDB + Mongoose** (tasks, attachments, history/logs)
- **Multer** (multipart file uploads)
- **Nodemailer** (SMTP email notifications)
- **Swagger (OpenAPI 3.0)** (API documentation)
- **Jest + Supertest** (tests)
- **Docker + Docker Compose** (portable runtime)

---

## RBAC Rules (Quick)

- **ADMIN**
  - Full access: users + tasks (CRUD), upload, notify.
- **MANAGER**
  - Can create tasks only for their **team** (`user.managerId === manager.id`)
  - Can update/notify/upload only tasks **created by them**
  - Can view tasks **created by them** OR **assigned to their team**
- **USER**
  - Can view tasks **assigned to them**
  - Can update only **status** for tasks assigned to them
  - Can upload attachments only for tasks assigned to them

---

## Seeded Accounts (Auto-created on server start)

Controlled via environment variables (see below).

| Role | Email | Password |
|------|-------|----------|
| ADMIN | `admin@test.com` | `Admin@123` |
| MANAGER | `manager@test.com` | `Manager@123` |

---

## Run with Docker (Recommended)

### 1) Prerequisites
- Install **Docker Desktop** (Windows/Mac) or Docker Engine (Linux)
- Ensure Docker is running

### 2) Start everything
```bash
docker compose up -d --build
```

### 3) Open docs
- Swagger UI: `http://localhost:3000/api/docs`

### 4) Stop
```bash
docker compose down
```

> Note: If your host already uses port **3306**, map MySQL to **3307** on host (example already supported).

---

## Run Locally (Without Docker)

### 1) Start databases
- MySQL running on `localhost:3306`
- MongoDB running on `localhost:27017`

### 2) Install + start
```bash
npm install
npm run dev
```

---

## Swagger “Screenshots-style” Steps (Good for reviewers)

1. Open **Swagger UI** at `http://localhost:3000/api/docs`
2. Expand **Auth → POST /login**
3. Login as seeded admin:
   - email: `admin@test.com`
   - password: `Admin@123`
4. Copy the `token` from response
5. Click **Authorize** (top-right lock icon) → paste:
   - `Bearer <token>`
6. Now try secured endpoints:
   - **Users → GET /users** (Admin only)
   - **Tasks → POST /tasks** (Admin/Manager)
7. For uploads:
   - **Tasks → POST /tasks/{id}/upload**
   - Click **Try it out**
   - Upload one or more files under form key `files`

---

## Environment Variables (.env)

Example (local):
```env
PORT=3000

JWT_SECRET=super-secret
JWT_EXPIRES_IN=1d

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=task_mgmt
MYSQL_USER=root
MYSQL_PASSWORD=root

MONGO_URI=mongodb://localhost:27017/task_mgmt

UPLOAD_DIR=uploads

# Seeding
SEED_ADMIN=true
SEED_ADMIN_EMAIL=admin@test.com
SEED_ADMIN_PASSWORD=Admin@123

SEED_MANAGER=true
SEED_MANAGER_EMAIL=manager@test.com
SEED_MANAGER_PASSWORD=Manager@123

# SMTP (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM="Task Manager <your_email@gmail.com>"
```

---

## Main API Endpoints

### Auth
- `POST /register` → create user (default role **USER**)
- `POST /login` → returns JWT

### Users (ADMIN only)
- `GET /users` → list users
- `POST /users` → create user (role + managerId)
- `PUT /users/{id}` → update user
- `DELETE /users/{id}` → deactivate/delete user (Admin only)

### Tasks
- `GET /tasks` → role-based filtering
- `POST /tasks` → create task (Admin/Manager)
- `PUT /tasks/{id}` → update task (field rules by role)
- `DELETE /tasks/{id}` → delete task (Admin only)
- `POST /tasks/{id}/upload` → upload attachments (multipart key: `files`)
- `POST /tasks/{id}/notify` → send email to assigned user (Admin/Manager rules)

---

## Tests

```bash
npm test
```

- Uses **Jest + Supertest**
- Covers auth, RBAC, users CRUD, tasks CRUD, upload, notify
- If you use ESM, Jest may require VM modules:
  - `NODE_OPTIONS=--experimental-vm-modules`

---

## Folder Structure (High-level)

```
task-management-api/
  src/
    config/
    controllers/
    db/            # mysql + mongo connectors
    middlewares/   # auth, rbac, validation, error handler
    models/        # sequelize models + mongoose schemas
    routes/
    services/
    utils/
    app.js
    server.js
  uploads/
  tests/ (or src/test/)
  docker-compose.yml
  Dockerfile
  README.md
```

---

## Notes

- Attachments are stored under `uploads/tasks/<taskId>/...` (bind-mounted in Docker).
- Email sending uses SMTP settings. For Gmail, use an **App Password** (not your normal password).
