<div align="center">

# StoreRate

### Discover stores. Share ratings. Make better choices.

A full-stack store rating platform with secure authentication, role-based dashboards, store management, and one-rating-per-store functionality.

<p>
  <img src="https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=20232A" alt="React 19" />
  <img src="https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Backend-Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Database-SQLite%20%7C%20MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="SQLite and MySQL" />
</p>

</div>

## Overview

StoreRate is a role-based web application for discovering stores and sharing ratings. Users can search stores by name or address, view average ratings, and submit or update their own rating. Administrators manage users and stores, while store owners can view their store dashboard and rating summary.

## Features

<table>
  <tr>
    <td width="33%"><strong>Authentication</strong><br />JWT login, signup, protected routes, bcrypt password hashing, and password updates.</td>
    <td width="33%"><strong>Store Discovery</strong><br />Search stores by name or address, view store details, and see average ratings.</td>
    <td width="33%"><strong>Role Control</strong><br />Separate experiences for normal users, store owners, and administrators.</td>
  </tr>
  <tr>
    <td><strong>Rating System</strong><br />Submit a rating from 1 to 5 stars and modify it later.</td>
    <td><strong>Admin Management</strong><br />View dashboard statistics and manage users and stores.</td>
    <td><strong>Responsive UI</strong><br />Clean layouts for desktop and mobile screens.</td>
  </tr>
</table>

## Roles and Login Flow

### Normal User

1. Open the application and select **Create an account**.
2. Register with your name, email, address, and password.
3. Log in using the **Normal User** role.
4. Open **Discover Stores** to search stores and rate them.
5. Select a star rating again whenever you want to modify your rating.

Normal users can only access user routes and can create their own accounts through signup.

### Store Owner

1. A store owner account is created by an administrator.
2. Log in using the **Store Owner** role.
3. Open **My Dashboard** to view the store connected to your account and its rating information.

Store owners cannot create their own store records from public signup. An administrator must create the account and associate the store.

### Administrator

1. Start the backend database connection.
2. Run the seed command to create the first administrator.
3. Log in using the **Administrator** role.
4. Use the dashboard to manage users, store owners, stores, and assignments.

#### Local seed account

The backend seed script creates this account for local development:

| Field | Value |
| --- | --- |
| Email | `admin@platform.com` |
| Password | `Admin@1234` |
| Role | `Administrator` |

Change this password before using the application in any shared or production environment.

## Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | React 19 | Component-based user interface |
| Frontend tooling | Vite | Development server and production build |
| Frontend routing | React Router DOM | Public and protected page navigation |
| Frontend HTTP | Axios | API requests to the backend |
| Backend | Node.js and Express 4 | REST API and request handling |
| Authentication | JSON Web Tokens | Stateless login sessions and authorization |
| Password security | bcryptjs | Secure password hashing and comparison |
| ORM | Sequelize | Models, relationships, queries, and persistence |
| Database | SQLite or MySQL | Local development or production data storage |
| Middleware | CORS, dotenv | Cross-origin requests and environment configuration |
| Validation | Express validators | Request input validation |

## Project Structure

```text
store-rating-platform/
├── backend/
│   ├── package.json
│   ├── README.md
│   ├── seeders/
│   │   └── seed.js                 # Creates the local admin account
│   └── src/
│       ├── app.js                  # Express app and route registration
│       ├── server.js               # Server entry point
│       ├── config/
│       │   └── database.js         # Sequelize database configuration
│       ├── controllers/            # Business logic for each feature
│       │   ├── adminController.js
│       │   ├── authController.js
│       │   ├── ratingController.js
│       │   ├── storeController.js
│       │   └── userController.js
│       ├── middlewares/
│       │   ├── authMiddleware.js   # JWT authentication
│       │   ├── errorHandler.js      # Global API error handling
│       │   └── roleMiddleware.js    # Role-based authorization
│       ├── models/                 # Sequelize models and relationships
│       │   ├── index.js
│       │   ├── Rating.js
│       │   ├── Store.js
│       │   └── User.js
│       ├── routes/                 # REST API route definitions
│       │   ├── adminRoutes.js
│       │   ├── authRoutes.js
│       │   ├── ratingRoutes.js
│       │   ├── storeRoutes.js
│       │   └── userRoutes.js
│       ├── utils/                  # JWT, hashing, and API response helpers
│       └── validators/             # Authentication, store, and rating rules
├── database/
│   └── schema.sql                  # MySQL schema and constraints
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       ├── main.jsx
│       ├── api/                   # Axios API modules
│       ├── assets/
│       ├── components/common/     # Navbar, tables, protected routes
│       ├── context/               # Authentication context
│       ├── pages/                 # Login, signup, dashboards, and stores
│       └── routes/                # Frontend route configuration
├── .env.example                   # Safe environment variable template
├── .gitignore                     # Ignores secrets and generated files
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 18 or later
- npm
- Git
- MySQL 8 or SQLite for local development

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repository>.git
cd store-rating-platform
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure the backend

Create `backend/.env`. SQLite is the simplest local option:

```env
PORT=5002
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
```

For MySQL, use the following instead:

```env
PORT=5002
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=store_rating_db
DB_USER=root
DB_PASSWORD=your-database-password
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
```

The backend supports SQLite through Sequelize for local development. The MySQL schema is available in `database/schema.sql`.

### 4. Seed the administrator

From the `backend` directory:

```bash
npm run seed
```

### 5. Start the backend

Development mode:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

The API runs at `http://localhost:5002` and the health check is available at:

```text
http://localhost:5002/api/health
```

### 6. Install and configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5002/api
```

Start the frontend:

```bash
npm run dev
```

Vite will display the local frontend URL, normally `http://localhost:5173`.

## Useful Commands

### Backend

```bash
npm run dev      # Start with nodemon
npm start        # Start the API server
npm run seed     # Create the local administrator
npm test         # Backend test script
```

### Frontend

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

## API Highlights

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signup` | Public | Register a normal user |
| `POST` | `/api/auth/login` | Public | Login for all three roles |
| `GET` | `/api/auth/me` | Authenticated | Get the current user |
| `PUT` | `/api/auth/update-password` | Authenticated | Update the current password |
| `GET` | `/api/user/stores` | Normal user | List and filter stores |
| `POST` | `/api/user/ratings` | Normal user | Submit or update a rating |
| `GET` | `/api/store/dashboard` | Store owner | View owner dashboard data |
| `GET` | `/api/admin/dashboard` | Administrator | View platform statistics |
| `GET` | `/api/admin/users` | Administrator | List and filter users |
| `POST` | `/api/admin/users` | Administrator | Create users and store owners |
| `GET` | `/api/admin/stores` | Administrator | List and filter stores |
| `POST` | `/api/admin/stores` | Administrator | Create and assign a store |

## Data Model

- A `User` can have one of three roles: `admin`, `user`, or `store_owner`.
- A `Store` belongs to one store-owner account.
- A `Rating` belongs to one user and one store.
- Each user can have only one rating per store. A later rating updates the existing record.
- Ratings are restricted to values from 1 through 5.
- Passwords are stored as bcrypt hashes, never as plain text.

## Security Notes

<ul>
  <li>Never commit <code>.env</code>, <code>.env.local</code>, database files, API keys, passwords, or JWT secrets.</li>
  <li>Use <code>.env.example</code> as the shareable configuration template.</li>
  <li>Replace the seeded administrator password before production use.</li>
  <li>Use a strong, unique <code>JWT_SECRET</code> in every deployed environment.</li>
  <li>Configure production CORS and HTTPS before deploying publicly.</li>
</ul>

## Verification

The frontend production build can be verified with:

```bash
cd frontend
npm run build
```

