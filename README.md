# TaskFlow — Mini SaaS Task Management System

A full-stack, production-ready SaaS task management application where multiple users can register, log in, and manage their own private task lists. Built with **React 18**, **Node.js/Express**, **PostgreSQL**, and **Sequelize ORM**. Each user's data is fully isolated — no user can ever see or modify another user's tasks.

---

## 📑 Table of Contents

1. [Live Demo](#-live-demo)
2. [Project Overview](#-project-overview)
3. [Features](#-features)
4. [Tech Stack](#️-tech-stack)
5. [Project Structure](#-project-structure)
6. [Prerequisites](#️-prerequisites)
7. [Local Setup — Backend](#-local-setup--backend)
8. [Local Setup — Frontend](#-local-setup--frontend)
9. [Running Both Servers](#-running-both-servers)
10. [Environment Variables Reference](#-environment-variables-reference)
11. [Database Schema](#-database-schema)
12. [API Reference](#-api-reference)
13. [Frontend Architecture](#-frontend-architecture)
14. [Security Implementation](#-security-implementation)
15. [Deployment Guide](#-deployment-guide)
16. [Testing the API](#-testing-the-api)
17. [Troubleshooting](#-troubleshooting)
18. [License](#-license)

---

## 🚀 Live Demo

- **Frontend:** *https://mini-saas-task-management-system-frontend.onrender.com*
- **Backend API:** *https://mini-saas-task-management-system-backend.onrender.com*

---

## 📋 Project Overview

TaskFlow is a multi-user task management SaaS application. Users register with their name, email, and password. After logging in, they receive a JWT token that authenticates all subsequent API requests. The backend enforces strict user isolation — every database query for tasks is scoped to the authenticated user's ID, making it impossible to access another user's data even by guessing task IDs.

The frontend is a single-page React application that communicates with the backend REST API via Axios. It stores the JWT token in `localStorage` and attaches it to every protected request via the `Authorization: Bearer <token>` header.

---

## ✨ Features

- ✅ User registration (name, email, password) with server-side validation
- ✅ User login with secure bcrypt password comparison
- ✅ JWT-based stateless authentication (7-day token expiry)
- ✅ Create tasks with a title (up to 500 characters)
- ✅ View all personal tasks, sorted newest-first
- ✅ Toggle task status between **Pending** and **Completed**
- ✅ Inline task title editing
- ✅ Delete tasks with confirmation
- ✅ Filter tasks by: **All** / **Pending** / **Completed**
- ✅ Task progress bar showing completion percentage
- ✅ Friendly, specific error messages for all failure cases
- ✅ Fully responsive UI with Tailwind CSS
- ✅ Complete user data isolation (users only see their own tasks)
- ✅ CORS configured to only allow requests from the frontend origin
- ✅ Health check endpoint (`GET /api/health`)
- ✅ Automatic database table creation on first run (Sequelize sync)

---

## 🛠️ Tech Stack

| Layer        | Technology                                                      | Version  |
|--------------|-----------------------------------------------------------------|----------|
| **Frontend** | React                                                           | 18.2.0   |
| **Frontend** | React Router DOM                                                | 6.14.2   |
| **Frontend** | Tailwind CSS                                                    | 3.3.3    |
| **Frontend** | Vite (build tool & dev server)                                  | 4.4.5    |
| **Frontend** | Axios (HTTP client)                                             | 1.4.0    |
| **Backend**  | Node.js                                                         | ≥ 16.x   |
| **Backend**  | Express.js                                                      | 4.18.2   |
| **Backend**  | Sequelize ORM                                                   | 6.32.1   |
| **Backend**  | jsonwebtoken (JWT)                                              | 9.0.0    |
| **Backend**  | bcryptjs (password hashing)                                     | 2.4.3    |
| **Backend**  | cors                                                            | 2.8.5    |
| **Backend**  | dotenv                                                          | 16.0.3   |
| **Database** | PostgreSQL                                                      | ≥ 13.x   |
| **Database** | pg (PostgreSQL Node.js driver)                                  | 8.11.0   |

---

## 📁 Project Structure

```
Mini SaaS Task Management System/
│
├── README.md                         ← You are here
├── .gitignore                        ← Root gitignore
├── package-lock.json
│
├── backend/                          ← Node.js + Express REST API
│   ├── server.js                     ← Express app entry point, middleware, route mounting
│   ├── package.json                  ← Backend dependencies & npm scripts
│   ├── .env                          ← Backend environment variables (DO NOT commit)
│   ├── .gitignore
│   │
│   ├── config/
│   │   └── database.js               ← Sequelize instance + connectDB() function
│   │
│   ├── models/
│   │   ├── index.js                  ← Imports models & defines associations (User hasMany Task)
│   │   ├── User.js                   ← User model: id, name, email, password, timestamps
│   │   └── Task.js                   ← Task model: id, title, status (enum), userId FK, timestamps
│   │
│   ├── controllers/
│   │   ├── authController.js         ← signup() and login() handler functions
│   │   └── taskController.js         ← getMyTasks(), createTask(), updateTask(), deleteTask()
│   │
│   ├── middlewares/
│   │   └── verifyToken.js            ← JWT verification middleware; attaches req.user
│   │
│   └── routes/
│       ├── authRoutes.js             ← POST /api/auth/signup, POST /api/auth/login
│       └── taskRoutes.js             ← GET/POST /api/tasks, PUT/DELETE /api/tasks/:id
│
└── frontend/                         ← React + Tailwind CSS SPA
    ├── index.html                    ← Vite HTML entry point
    ├── package.json                  ← Frontend dependencies & npm scripts
    ├── vite.config.js                ← Vite config: React plugin, dev server port 5173, API proxy
    ├── tailwind.config.js            ← Tailwind CSS configuration
    ├── postcss.config.js             ← PostCSS configuration for Tailwind
    ├── .env                          ← Frontend environment variables
    ├── .gitignore
    │
    └── src/
        ├── main.jsx                  ← React DOM root render, wraps app in BrowserRouter
        ├── App.jsx                   ← Route definitions: / → Login, /dashboard → Dashboard
        ├── index.css                 ← Tailwind CSS directives (@tailwind base/components/utilities)
        │
        ├── components/
        │   ├── Navbar.jsx            ← Top navigation bar with user name display & logout button
        │   └── TaskItem.jsx          ← Individual task card: inline edit, toggle status, delete
        │
        ├── pages/
        │   ├── Login.jsx             ← Combined Login & Signup page with form toggle
        │   └── Dashboard.jsx         ← Main task management page: add tasks, filter, progress bar
        │
        └── services/
            └── api.js                ← Axios instance with baseURL from VITE_API_URL env var
```

---

## ⚙️ Prerequisites

Before running this project locally, ensure you have the following installed:

### Required Software

| Software       | Minimum Version | Download Link                                      |
|----------------|-----------------|----------------------------------------------------|
| **Node.js**    | v16.0.0         | https://nodejs.org/ (LTS recommended)              |
| **npm**        | v8.0.0          | Included with Node.js                              |
| **PostgreSQL** | v13.0           | https://www.postgresql.org/download/               |
| **Git**        | Any             | https://git-scm.com/                               |

### Verify Your Installations

Open a terminal and run:

```bash
node --version      # Should print v16.x.x or higher
npm --version       # Should print 8.x.x or higher
psql --version      # Should print psql (PostgreSQL) 13.x or higher
git --version       # Should print git version x.x.x
```

### PostgreSQL Alternatives

If you don't want to install PostgreSQL locally, you can use a free cloud database:
- **[Supabase](https://supabase.com/)** — Free tier, provides a PostgreSQL connection string
- **[Neon](https://neon.tech/)** — Free tier, serverless PostgreSQL
- **[ElephantSQL](https://www.elephantsql.com/)** — Free tier (20MB)

---

## 🔧 Local Setup — Backend

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/mini-saas-task-app.git
cd "Mini SaaS Task Management System"
```

### Step 2: Create the PostgreSQL Database

Connect to PostgreSQL using the `psql` command-line tool:

```bash
# On Windows (run as the postgres user)
psql -U postgres

# On macOS/Linux
psql -U postgres
# or if using a different superuser:
sudo -u postgres psql
```

Once inside the `psql` shell, create the database:

```sql
CREATE DATABASE task_management_db;
```

Verify it was created:

```sql
\l
```

Exit the psql shell:

```sql
\q
```

> **Note:** The application uses Sequelize's `sync({ alter: true })` on startup, which **automatically creates the `users` and `tasks` tables** if they don't exist. You do **not** need to run any SQL migration scripts manually.

### Step 3: Navigate to the Backend Directory

```bash
cd backend
```

### Step 4: Install Backend Dependencies

```bash
npm install
```

This installs all packages listed in [`backend/package.json`](backend/package.json):
- `express` — Web framework
- `sequelize` + `pg` + `pg-hstore` — ORM and PostgreSQL driver
- `bcryptjs` — Password hashing
- `jsonwebtoken` — JWT creation and verification
- `cors` — Cross-Origin Resource Sharing
- `dotenv` — Environment variable loading
- `nodemon` (dev dependency) — Auto-restart on file changes

### Step 5: Configure Backend Environment Variables

The backend requires a `.env` file in the `backend/` directory. A `.env` file is already present in this project. Review and update it with your PostgreSQL credentials:

```bash
# backend/.env
PORT=5000
DB_HOST=localhost
DB_PORT=5433
DB_NAME=task_management_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
JWT_SECRET=taskflow_super_secret_jwt_key_2024_change_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> **⚠️ Important:** The default `DB_PORT` in this project is `5433`. Standard PostgreSQL installations use port `5432`. Check which port your PostgreSQL instance is running on:
> ```bash
> # On Windows, check PostgreSQL service properties
> # Or run in psql:
> SHOW port;
> ```
> Update `DB_PORT` in your `.env` accordingly.

> **⚠️ Security Warning:** Never commit your `.env` file to version control. It is already listed in [`backend/.gitignore`](backend/.gitignore).

### Step 6: Start the Backend Server

**For development** (with auto-restart on file changes via nodemon):

```bash
npm run dev
```

**For production** (plain Node.js):

```bash
npm start
```

### Step 7: Verify the Backend is Running

You should see the following output in your terminal:

```
✅ PostgreSQL connected successfully via Sequelize.
✅ Database tables synced successfully.
🚀 Server is running on http://localhost:5000
```

You can also verify via the health check endpoint:

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{ "status": "OK", "message": "Server is running." }
```

---

## 🎨 Local Setup — Frontend

### Step 1: Open a New Terminal

Keep the backend terminal running. Open a **new, separate terminal window/tab**.

### Step 2: Navigate to the Frontend Directory

```bash
# From the project root:
cd frontend
```

### Step 3: Install Frontend Dependencies

```bash
npm install
```

This installs all packages listed in [`frontend/package.json`](frontend/package.json):
- `react` + `react-dom` — UI library
- `react-router-dom` — Client-side routing
- `axios` — HTTP client for API calls
- `vite` — Build tool and dev server
- `tailwindcss` + `postcss` + `autoprefixer` — CSS framework

### Step 4: Configure Frontend Environment Variables

The frontend requires a `.env` file in the `frontend/` directory. A `.env` file is already present:

```bash
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

> **Note:** All Vite environment variables **must** be prefixed with `VITE_` to be accessible in the browser. This variable is consumed in [`frontend/src/services/api.js`](frontend/src/services/api.js) as `import.meta.env.VITE_API_URL`.

> **Note:** The Vite dev server also has a built-in proxy configured in [`frontend/vite.config.js`](frontend/vite.config.js) that forwards any request starting with `/api` to `http://localhost:5000`. This means you can also use relative API paths during development.

### Step 5: Start the Frontend Dev Server

```bash
npm run dev
```

You should see:

```
  VITE v4.4.5  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 6: Open the Application

Open your browser and navigate to:

```
http://localhost:5173
```

You will be redirected to the Login/Signup page. Create a new account to get started.

---

## ▶️ Running Both Servers

You need **two terminal windows** running simultaneously:

| Terminal | Directory  | Command       | URL                        |
|----------|------------|---------------|----------------------------|
| 1        | `backend/` | `npm run dev` | http://localhost:5000      |
| 2        | `frontend/`| `npm run dev` | http://localhost:5173      |

**Quick start (from project root, using two terminals):**

```bash
# Terminal 1 — Backend
cd backend && npm install && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)

| Variable       | Required | Default                                              | Description                                                                                   |
|----------------|----------|------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| `PORT`         | No       | `5000`                                               | The port the Express server listens on                                                        |
| `DB_HOST`      | Yes      | `localhost`                                          | PostgreSQL server hostname                                                                    |
| `DB_PORT`      | No       | `5432`                                               | PostgreSQL server port (this project defaults to `5433` — verify your installation)           |
| `DB_NAME`      | Yes      | —                                                    | Name of the PostgreSQL database (e.g., `task_management_db`)                                  |
| `DB_USER`      | Yes      | —                                                    | PostgreSQL username (e.g., `postgres`)                                                        |
| `DB_PASSWORD`  | Yes      | —                                                    | PostgreSQL password for the above user                                                        |
| `JWT_SECRET`   | Yes      | —                                                    | Secret key used to sign and verify JWT tokens. **Use a long, random string in production.**   |
| `NODE_ENV`     | No       | `development`                                        | Set to `production` in production. Controls Sequelize SQL logging.                            |
| `FRONTEND_URL` | No       | `http://localhost:5173`                              | The allowed CORS origin. Must match the frontend URL exactly.                                 |

### Frontend (`frontend/.env`)

| Variable        | Required | Default                        | Description                                                                 |
|-----------------|----------|--------------------------------|-----------------------------------------------------------------------------|
| `VITE_API_URL`  | Yes      | `http://localhost:5000/api`    | The base URL for all API requests. Change to your deployed backend URL in production. |

---

## 🗄️ Database Schema

The application uses two tables, automatically created by Sequelize on first startup.

### `users` Table

| Column       | Type          | Constraints                          | Description                          |
|--------------|---------------|--------------------------------------|--------------------------------------|
| `id`         | INTEGER       | PRIMARY KEY, AUTO INCREMENT          | Unique user identifier               |
| `name`       | VARCHAR(255)  | NOT NULL, length 2–100               | User's display name                  |
| `email`      | VARCHAR(255)  | NOT NULL, UNIQUE, valid email format | User's email address (lowercased)    |
| `password`   | VARCHAR(255)  | NOT NULL                             | bcrypt-hashed password (12 rounds)   |
| `createdAt`  | TIMESTAMP     | NOT NULL                             | Auto-managed by Sequelize            |
| `updatedAt`  | TIMESTAMP     | NOT NULL                             | Auto-managed by Sequelize            |

### `tasks` Table

| Column       | Type                        | Constraints                          | Description                                    |
|--------------|-----------------------------|--------------------------------------|------------------------------------------------|
| `id`         | INTEGER                     | PRIMARY KEY, AUTO INCREMENT          | Unique task identifier                         |
| `title`      | VARCHAR(255)                | NOT NULL, length 1–500               | Task description/title                         |
| `status`     | ENUM('pending','completed') | NOT NULL, DEFAULT 'pending'          | Current task status                            |
| `userId`     | INTEGER                     | NOT NULL, FOREIGN KEY → users(id)    | Owner of the task (enforces data isolation)    |
| `createdAt`  | TIMESTAMP                   | NOT NULL                             | Auto-managed by Sequelize                      |
| `updatedAt`  | TIMESTAMP                   | NOT NULL                             | Auto-managed by Sequelize                      |

### Associations

```
User (1) ──────────────── (many) Task
  id  ←──────────────────── userId (FK)
```

Defined in [`backend/models/index.js`](backend/models/index.js):
- `User.hasMany(Task, { foreignKey: 'userId' })`
- `Task.belongsTo(User, { foreignKey: 'userId' })`

---

## 📡 API Reference

**Base URL (local):** `http://localhost:5000/api`

All request and response bodies use `Content-Type: application/json`.

---

### Health Check

#### `GET /api/health`

Verifies the server is running. No authentication required.

**Response `200 OK`:**
```json
{
  "status": "OK",
  "message": "Server is running."
}
```

---

### Authentication Routes (`/api/auth`)

#### `POST /api/auth/signup` — Register a New User

**Authentication Required:** No

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

**Validation Rules:**
- `name`: Required, minimum 2 characters
- `email`: Required, must be a valid email format
- `password`: Required, minimum 6 characters

**Response `201 Created`:**
```json
{
  "message": "Account created successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

**Error Responses:**

| Status | Condition                          | Error Message                                        |
|--------|------------------------------------|------------------------------------------------------|
| `400`  | Missing name, email, or password   | `"Name, email, and password are required."`          |
| `400`  | Name shorter than 2 characters     | `"Name must be at least 2 characters long."`         |
| `400`  | Password shorter than 6 characters | `"Password must be at least 6 characters long."`     |
| `409`  | Email already registered           | `"An account with this email already exists."`       |
| `500`  | Server/database error              | `"Server error during signup. Please try again."`    |

---

#### `POST /api/auth/login` — Login an Existing User

**Authentication Required:** No

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

**Response `200 OK`:**
```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

**Error Responses:**

| Status | Condition                    | Error Message                                      |
|--------|------------------------------|----------------------------------------------------|
| `400`  | Missing email or password    | `"Email and password are required."`               |
| `401`  | Email not found              | `"Invalid email or password."`                     |
| `401`  | Wrong password               | `"Invalid email or password."`                     |
| `500`  | Server/database error        | `"Server error during login. Please try again."`   |

---

### Task Routes (`/api/tasks`)

> **All task routes require authentication.**
> Include the JWT token in the `Authorization` header:
> ```
> Authorization: Bearer <your_jwt_token>
> ```

---

#### `GET /api/tasks` — Get All Tasks for the Logged-In User

Returns all tasks belonging to the authenticated user, sorted by `createdAt` descending (newest first).

**Response `200 OK`:**
```json
{
  "tasks": [
    {
      "id": 3,
      "title": "Write unit tests",
      "status": "pending",
      "userId": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "title": "Review pull request",
      "status": "completed",
      "userId": 1,
      "createdAt": "2024-01-14T09:00:00.000Z",
      "updatedAt": "2024-01-14T11:00:00.000Z"
    }
  ]
}
```

**Error Responses:**

| Status | Condition                    | Error Message                                  |
|--------|------------------------------|------------------------------------------------|
| `403`  | No token provided            | `"Access Denied. No token provided."`          |
| `403`  | Malformed token header       | `"Access Denied. Invalid token format."`       |
| `401`  | Token expired                | `"Token has expired. Please log in again."`    |
| `401`  | Invalid/tampered token       | `"Invalid Token."`                             |
| `500`  | Server/database error        | `"Server error while fetching tasks."`         |

---

#### `POST /api/tasks` — Create a New Task

**Request Body:**
```json
{
  "title": "Buy groceries"
}
```

**Validation Rules:**
- `title`: Required, non-empty, maximum 500 characters

**Response `201 Created`:**
```json
{
  "message": "Task created successfully.",
  "task": {
    "id": 4,
    "title": "Buy groceries",
    "status": "pending",
    "userId": 1,
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Condition                    | Error Message                                          |
|--------|------------------------------|--------------------------------------------------------|
| `400`  | Missing or empty title       | `"Task title is required."`                            |
| `400`  | Title exceeds 500 characters | `"Task title must be 500 characters or less."`         |
| `500`  | Server/database error        | `"Server error while creating task."`                  |

---

#### `PUT /api/tasks/:id` — Update a Task

Updates the `title`, `status`, or both fields of a task. The task must belong to the authenticated user.

**URL Parameter:** `:id` — the integer ID of the task to update

**Request Body** (all fields optional, but at least one should be provided):
```json
{
  "title": "Updated task title",
  "status": "completed"
}
```

**Valid `status` values:** `"pending"` or `"completed"`

**Response `200 OK`:**
```json
{
  "message": "Task updated successfully.",
  "task": {
    "id": 4,
    "title": "Updated task title",
    "status": "completed",
    "userId": 1,
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Condition                                    | Error Message                                                                    |
|--------|----------------------------------------------|----------------------------------------------------------------------------------|
| `400`  | Invalid status value                         | `"Status must be either \"pending\" or \"completed\"."`                          |
| `400`  | Title is empty string                        | `"Task title cannot be empty."`                                                  |
| `404`  | Task not found or belongs to another user    | `"Task not found or you do not have permission to update it."`                   |
| `500`  | Server/database error                        | `"Server error while updating task."`                                            |

---

#### `DELETE /api/tasks/:id` — Delete a Task

Permanently deletes a task. The task must belong to the authenticated user.

**URL Parameter:** `:id` — the integer ID of the task to delete

**Response `200 OK`:**
```json
{
  "message": "Task deleted successfully."
}
```

**Error Responses:**

| Status | Condition                                    | Error Message                                                                    |
|--------|----------------------------------------------|----------------------------------------------------------------------------------|
| `404`  | Task not found or belongs to another user    | `"Task not found or you do not have permission to delete it."`                   |
| `500`  | Server/database error                        | `"Server error while deleting task."`                                            |

---

## 🖥️ Frontend Architecture

### Routing

Defined in [`frontend/src/App.jsx`](frontend/src/App.jsx):

| Path           | Component     | Access      | Description                                      |
|----------------|---------------|-------------|--------------------------------------------------|
| `/`            | `Login`       | Public      | Login and signup forms (toggled on the same page)|
| `/dashboard`   | `Dashboard`   | Protected   | Main task management interface                   |

Route protection is handled client-side: if no JWT token exists in `localStorage`, the user is redirected to `/`.

### Key Components

**[`frontend/src/services/api.js`](frontend/src/services/api.js)**
- Creates an Axios instance with `baseURL` set to `import.meta.env.VITE_API_URL`
- All API calls go through this instance

**[`frontend/src/pages/Login.jsx`](frontend/src/pages/Login.jsx)**
- Handles both login and signup in a single page with a toggle
- On success, stores the JWT token and user object in `localStorage`
- Redirects to `/dashboard`

**[`frontend/src/pages/Dashboard.jsx`](frontend/src/pages/Dashboard.jsx)**
- Fetches all tasks on mount using the stored JWT token
- Manages task creation, filtering (All/Pending/Completed), and displays a progress bar
- Passes task data and action handlers down to `TaskItem` components

**[`frontend/src/components/TaskItem.jsx`](frontend/src/components/TaskItem.jsx)**
- Renders a single task card
- Supports inline title editing (click to edit, Enter/blur to save)
- Toggle status button and delete button

**[`frontend/src/components/Navbar.jsx`](frontend/src/components/Navbar.jsx)**
- Displays the app name and the logged-in user's name
- Logout button clears `localStorage` and redirects to `/`

### JWT Token Storage

The JWT token is stored in `localStorage` under the key `token`. The user object is stored under the key `user`. On logout, both are removed.

---

## 🔒 Security Implementation

| Feature                  | Implementation Detail                                                                                                    |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------|
| **Password Hashing**     | `bcryptjs` with **12 salt rounds**. Passwords are never stored in plain text.                                            |
| **JWT Authentication**   | Tokens signed with `HS256` algorithm, expire after **7 days**. Secret key loaded from environment variable.             |
| **Route Protection**     | All task routes pass through [`verifyToken`](backend/middlewares/verifyToken.js) middleware before reaching controllers. |
| **User Data Isolation**  | Every task query includes `WHERE userId = req.user.id`, preventing cross-user data access even with valid tokens.        |
| **Input Validation**     | Server-side validation on all inputs (name length, email format, password length, title length, status enum values).     |
| **CORS Policy**          | Configured to only accept requests from `FRONTEND_URL` (defaults to `http://localhost:5173`).                            |
| **Token Expiry Handling**| Expired tokens return `401` with a specific message; the frontend should redirect to login.                              |
| **Email Normalization**  | All emails are lowercased before storage and lookup, preventing duplicate accounts via case differences.                 |

---

## 🚢 Deployment Guide

### 1. Deploy the Database (Supabase — Recommended Free Option)

1. Create a free account at [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to **Settings → Database** and copy the connection string
4. Note the host, port, database name, user, and password for your backend `.env`

### 2. Deploy the Backend (Render)

1. Push your code to a GitHub repository
2. Create a free account at [render.com](https://render.com/)
3. Click **New → Web Service**
4. Connect your GitHub repository
5. Configure the service:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add all environment variables from your `backend/.env`:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (from Supabase)
   - `JWT_SECRET` (use a strong random string)
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = your Vercel frontend URL (add after deploying frontend)
7. Deploy and copy the service URL (e.g., `https://taskflow-api.onrender.com`)

### 3. Deploy the Frontend (Vercel)

1. Create
a free account at [vercel.com](https://vercel.com/)
2. Click **New Project** and import your GitHub repository
3. Configure the project:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable: `VITE_API_URL` = `https://your-backend.onrender.com/api`
5. Deploy and copy the frontend URL (e.g., `https://taskflow.vercel.app`)
6. Go back to your Render backend service → **Environment** and update `FRONTEND_URL` to your Vercel URL
7. Redeploy the backend to apply the CORS change

---

## 🧪 Testing the API

You can test all API endpoints using [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), or `curl` from the command line.

### Using curl

#### 1. Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\",\"password\":\"password123\"}"
```

#### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"jane@example.com\",\"password\":\"password123\"}"
```

Copy the `token` value from the response. Use it in all subsequent requests by replacing `YOUR_JWT_TOKEN_HERE`.

#### 3. Get All Tasks

```bash
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### 4. Create a Task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy groceries\"}"
```

#### 5. Update a Task (Toggle to Completed)

```bash
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"completed\"}"
```

#### 6. Update a Task Title

```bash
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy groceries and cook dinner\"}"
```

#### 7. Delete a Task

```bash
curl -X DELETE http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### 8. Health Check

```bash
curl http://localhost:5000/api/health
```

### Using Postman

1. Set the base URL to `http://localhost:5000`
2. For protected routes, go to the **Authorization** tab → select **Bearer Token** → paste your JWT token
3. Set the **Content-Type** header to `application/json` for POST and PUT requests

---

## 🔧 Troubleshooting

### Backend Issues

#### ❌ `Unable to connect to the database`

```
❌ Unable to connect to the database: connect ECONNREFUSED 127.0.0.1:5433
```

**Causes & Fixes:**
- PostgreSQL is not running. Start it:
  - **Windows:** Open Services (`services.msc`) → find `postgresql-x64-XX` → Start
  - **macOS:** `brew services start postgresql`
  - **Linux:** `sudo systemctl start postgresql`
- Wrong `DB_PORT`. Standard PostgreSQL uses `5432`. This project defaults to `5433`. Check your installation and update `backend/.env`.
- Wrong `DB_HOST`. Use `localhost` or `127.0.0.1` for local installations.

#### ❌ `password authentication failed for user "postgres"`

**Fix:** Update `DB_PASSWORD` in `backend/.env` to match your PostgreSQL superuser password set during installation.

#### ❌ `database "task_management_db" does not exist`

**Fix:** Create the database manually:
```bash
psql -U postgres -c "CREATE DATABASE task_management_db;"
```

#### ❌ `Error: JWT_SECRET is not defined`

**Fix:** Ensure `backend/.env` exists and contains the `JWT_SECRET` variable. Make sure you ran `npm start` or `npm run dev` from inside the `backend/` directory.

#### ❌ Port 5000 already in use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Fix:** Kill the process using port 5000, or change `PORT` in `backend/.env` and update `VITE_API_URL` in `frontend/.env` accordingly.

```bash
# Windows — find and kill the process:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

---

### Frontend Issues

#### ❌ `Network Error` or CORS error in browser console

**Causes & Fixes:**
- The backend server is not running. Start it with `npm run dev` in the `backend/` directory.
- `VITE_API_URL` in `frontend/.env` does not match the backend URL. Ensure it is `http://localhost:5000/api`.
- `FRONTEND_URL` in `backend/.env` does not match the frontend URL. Ensure it is `http://localhost:5173`.
- After changing any `.env` file, **restart both servers**.

#### ❌ `401 Unauthorized` on all task requests after login

**Cause:** The JWT token in `localStorage` may be expired or malformed.

**Fix:** Open browser DevTools → **Application** tab → **Local Storage** → delete the `token` and `user` entries → log in again.

#### ❌ Frontend changes not reflecting

**Fix:** Vite has hot module replacement (HMR). If changes aren't showing, try a hard refresh (`Ctrl+Shift+R` on Windows/Linux, `Cmd+Shift+R` on macOS) or restart the Vite dev server.

#### ❌ Blank page on `/dashboard` after hard refresh

**Cause:** Client-side routing — the browser requests `/dashboard` from the server which doesn't know that route.

**Fix (Production/Vercel):** Add a `vercel.json` file inside the `frontend/` directory:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

### Database Issues

#### ❌ Tables not created automatically

The application uses `sequelize.sync({ alter: true })` which creates tables if they don't exist. If this fails:

1. Check the backend terminal for error messages
2. Ensure the database user has `CREATE TABLE` privileges:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE task_management_db TO postgres;
   ```

#### ❌ `SequelizeUniqueConstraintError` on signup

**Cause:** Attempting to register with an email that already exists in the database.

**Fix:** Use a different email address, or delete the existing user:
```sql
DELETE FROM users WHERE email = 'your@email.com';
```

---

## 📝 npm Scripts Reference

### Backend (`backend/`)

| Script        | Command             | Description                                         |
|---------------|---------------------|-----------------------------------------------------|
| `npm start`   | `node server.js`    | Start the server in production mode                 |
| `npm run dev` | `nodemon server.js` | Start the server in development mode (auto-restart) |

### Frontend (`frontend/`)

| Script            | Command        | Description                                              |
|-------------------|----------------|----------------------------------------------------------|
| `npm run dev`     | `vite`         | Start the Vite development server at port 5173           |
| `npm run build`   | `vite build`   | Build the production bundle to the `dist/` directory     |
| `npm run preview` | `vite preview` | Preview the production build locally                     |
| `npm run lint`    | `eslint .`     | Run ESLint on all JS/JSX files                           |

---

## 📄 License

MIT License — feel free to use this project for learning and portfolio purposes.

---

*Built with ❤️ using React, Node.js, Express, PostgreSQL, and Tailwind CSS.*
