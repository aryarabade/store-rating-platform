# StoreRate

StoreRate is a full-stack store rating platform. Users can discover stores, search by name or address, view average ratings, and submit or update their own rating. Administrators manage users and stores, while store owners can view the store assigned to them and its rating summary.

The application has a React/Vite frontend, an Express REST API, and a Sequelize data layer that supports SQLite for local development and MySQL for deployment.

## Features

- JWT authentication with bcrypt password hashing
- Three roles: `user`, `store_owner`, and `admin`
- Protected routes with role-based authorization
- Store search by name and address
- Average store ratings and the logged-in user's rating
- One rating per user per store; submitting again updates the existing rating
- Admin dashboard statistics
- Admin user and store management
- Store-owner dashboard with average rating and rating history
- Password updates for authenticated users
- Responsive React interface for desktop and mobile screens

## Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | React 19 | User interface and reusable components |
| Frontend tooling | Vite | Development server and production builds |
| Routing | React Router DOM | Public and protected page navigation |
| HTTP client | Axios | Frontend requests to the API |
| Backend | Node.js and Express 4 | REST API and middleware |
| Authentication | JSON Web Tokens | Stateless login sessions |
| Password security | bcryptjs | Password hashing and comparison |
| ORM | Sequelize | Models, relationships, queries, and persistence |
| Database | SQLite or MySQL | Local or production data storage |
| Validation | Custom Express validators | Request and field validation |

## How the Application Works

1. The backend connects to the configured database and runs `sequelize.sync()` to create missing tables.
2. A user signs up or an administrator creates an account. Passwords are hashed before they are stored.
3. On login, the API checks the email, password, and selected role, then returns a JWT.
4. The frontend stores the token in `localStorage`. Axios automatically sends it as `Authorization: Bearer <token>` on protected requests.
5. The backend verifies the token, loads the user, and applies role middleware before allowing dashboard actions.
6. A normal user searches stores and selects 1 to 5 stars. The rating is created the first time and updated on later submissions.
7. A store owner sees only the store linked to their account, including its average rating and the users who rated it.
8. An administrator manages users, creates stores, assigns each store to an existing store-owner account, and can update or delete stores.

## Roles and Account Setup

### Normal user

Normal users can create an account from the public signup page, log in, browse stores, and rate them. Their frontend pages are `/user/dashboard` and `/stores`.

### Store owner

The intended workflow is:

1. Log in as an administrator.
2. Create a user with role `store_owner` in **Manage Users**.
3. Note the new user's numeric `id`.
4. Create a store in **Manage Stores** and use that user's `id` as `ownerId`.
5. Log in as the store owner and open `/owner/dashboard`.

The store-owner account can exist before a store is assigned, but its dashboard will show that no store is linked until the administrator creates the association. The current public signup endpoint technically accepts `admin` and `store_owner` role values too; however, using the admin workflow above is the recommended way to create privileged accounts and link stores.

### Administrator

The seed command creates the first administrator. Additional administrators can be created by an existing administrator through the admin user-management endpoint.

## Example Accounts and Values

These are example values for local development. They are not automatically created unless stated otherwise.

### Seeded administrator

Run `npm run seed` from `backend/` first.

| Field | Value |
| --- | --- |
| Name | `System Administrator` |
| Email | `admin@platform.com` |
| Password | `Admin@1234` |
| Role | `admin` |

At login, select **Administrator**. Change this password before using the application outside local development.

### Normal user signup example

The name must be 20 to 60 characters, the password must be 8 to 16 characters with at least one uppercase letter and one special character, and the address can be up to 400 characters.

```json
{
  "name": "Alex Morgan Store Explorer",
  "email": "alex@example.com",
  "address": "24 Market Street, Pune",
  "password": "StoreUser@1",
  "role": "user"
}
```

Log in with:

```json
{
  "email": "alex@example.com",
  "password": "StoreUser@1",
  "selectedRole": "user"
}
```

### Store-owner example

Create the account as an administrator using values such as:

```json
{
  "name": "Jordan Lee Retail Manager",
  "email": "jordan.owner@example.com",
  "address": "18 High Street, Mumbai",
  "password": "OwnerPass@1",
  "role": "store_owner"
}
```

After the API returns the new user's `id`, create the store with that ID:

```json
{
  "name": "Jordan's Market Place",
  "email": "jordan.store@example.com",
  "address": "18 High Street, Mumbai",
  "ownerId": 2
}
```

Replace `2` with the actual store-owner user ID. The owner can then log in using the same email and password with `selectedRole: "store_owner"`.

### Additional administrator example

Only an authenticated administrator should create additional admin accounts:

```json
{
  "name": "Taylor Smith Platform Manager",
  "email": "taylor.admin@example.com",
  "address": "Head Office",
  "password": "AdminPass@1",
  "role": "admin"
}
```

## Project Structure and File Responsibilities

```text
store-rating-platform/
├── README.md                         Project documentation
├── .env.example                      Backend environment template
├── database/schema.sql               MySQL schema reference
├── backend/
│   ├── package.json                  Backend scripts and dependencies
│   ├── .env                          Local backend configuration, not committed
│   ├── seeders/seed.js               Creates the local administrator
│   └── src/
│       ├── app.js                    Express app, middleware, health check, routes
│       ├── server.js                 Database startup, model sync, HTTP server
│       ├── config/database.js        SQLite/MySQL Sequelize configuration
│       ├── controllers/              Request handlers and business logic
│       ├── middlewares/
│       │   ├── authMiddleware.js     Verifies JWT and loads the current user
│       │   ├── roleMiddleware.js     Restricts routes to allowed roles
│       │   └── errorHandler.js       Handles uncaught API errors
│       ├── models/
│       │   ├── User.js               User fields and roles
│       │   ├── Store.js              Store fields and owner relationship
│       │   ├── Rating.js             Rating fields and unique user/store rule
│       │   └── index.js               Model associations and exports
│       ├── routes/                   URL-to-controller route definitions
│       ├── utils/
│       │   ├── apiResponse.js        Consistent success/error response format
│       │   ├── hashPassword.js       bcrypt hashing helper
│       │   └── jwt.js                JWT signing and verification
│       └── validators/               Signup, password, store, and rating rules
└── frontend/
    ├── package.json                  Frontend scripts and dependencies
    ├── vite.config.js                Vite configuration
    └── src/
        ├── main.jsx                  React entry point
        ├── App.jsx                   Root application component
        ├── App.css, index.css        Application and global styles
        ├── api/                      Axios API modules by feature
        ├── context/AuthContext.jsx   Login, signup, logout, and session restore
        ├── components/common/       Navbar, tables, and protected-route wrapper
        ├── routes/AppRoutes.jsx      Public routes and role-based page routes
        └── pages/                    Home, auth, user, owner, and admin screens
```

### Backend route modules

| File | Responsibility |
| --- | --- |
| `authRoutes.js` | Signup, login, current-user lookup, password update |
| `userRoutes.js` | Normal-user store list and rating upsert |
| `ratingRoutes.js` | Store ratings, submit, and update endpoints |
| `storeRoutes.js` | Store-owner dashboard |
| `adminRoutes.js` | Admin dashboard, user management, and store management |

## Local Setup

### Prerequisites

- Node.js 18 or later
- npm
- SQLite for the simplest local setup, or MySQL 8+

### 1. Install dependencies

From the project root:

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Configure the backend

Create `backend/.env`. For SQLite, use:

```env
PORT=5002
DB_DIALECT=sqlite
DB_STORAGE=database.sqlite
DB_HOST=
DB_PORT=3306
DB_NAME=
DB_USER=
DB_PASSWORD=
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
```

The backend reads this file from `backend/.env`. The SQLite database file is created automatically and is ignored by Git.

For MySQL, replace the database settings with:

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

### 3. Seed the administrator

From the `backend/` directory:

```bash
npm run seed
```

The seed is safe to run again; it reports that the admin already exists instead of creating a duplicate.

### 4. Start the backend

From `backend/`:

```bash
npm run dev
```

Or start without nodemon:

```bash
npm start
```

The API is available at `http://localhost:5002`. Confirm it is running at `http://localhost:5002/api/health`.

### 5. Configure and start the frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5002/api
```

In a second terminal:

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## API Reference

All protected endpoints require `Authorization: Bearer <jwt-token>`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Check API availability |
| `POST` | `/api/auth/signup` | Public | Create an account |
| `POST` | `/api/auth/login` | Public | Log in with email, password, and selected role |
| `GET` | `/api/auth/me` | Any authenticated role | Get the current user |
| `PUT` | `/api/auth/update-password` | Any authenticated role | Change the current password |
| `GET` | `/api/user/stores` | `user` | Search and list stores with ratings |
| `POST` | `/api/user/ratings` | `user` | Submit or update a rating |
| `GET` | `/api/ratings/store/:storeId` | `user` | List ratings for a store |
| `POST` | `/api/ratings` | `user` | Submit a rating |
| `PUT` | `/api/ratings` | `user` | Update a rating |
| `GET` | `/api/store/dashboard` | `store_owner` | View assigned store and rating summary |
| `GET` | `/api/admin/dashboard` | `admin` | View user, store, and rating counts |
| `POST` | `/api/admin/users` | `admin` | Create a user, store owner, or admin |
| `GET` | `/api/admin/users` | `admin` | Filter and sort users |
| `GET` | `/api/admin/users/:id` | `admin` | View user details and linked store |
| `POST` | `/api/admin/stores` | `admin` | Create and assign a store |
| `GET` | `/api/admin/stores` | `admin` | Filter and sort stores |
| `PUT` | `/api/admin/stores/:id` | `admin` | Update a store or its owner |
| `DELETE` | `/api/admin/stores/:id` | `admin` | Delete a store and its ratings |

Store and user list endpoints support query filters such as `name`, `email`, and `address`. Admin user lists also support `role`; list endpoints support `sortBy` and `order=ASC|DESC`.

## Frontend Pages

| Path | Role | Page |
| --- | --- | --- |
| `/` | Public | Home page |
| `/login` | Public | Login |
| `/signup` | Public | Account creation |
| `/user/dashboard` | `user` | Store discovery and ratings |
| `/stores` | `user` | Store discovery alias |
| `/owner/dashboard` | `store_owner` | Owner rating dashboard |
| `/admin/dashboard` | `admin` | Admin statistics |
| `/admin/users` | `admin` | Manage users |
| `/admin/stores` | `admin` | Manage stores |
| `/update-password` | Any authenticated role | Update password |

## Useful Commands

### Backend

```bash
npm run dev
npm start
npm run seed
npm test
```

`npm test` currently runs the placeholder script configured in `backend/package.json`; no automated backend tests are defined yet.

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Data Model

- A `User` has one role: `admin`, `user`, or `store_owner`.
- A `Store` belongs to one store-owner user through `owner_id`.
- A `Rating` belongs to one user and one store.
- A unique database index on `(user_id, store_id)` enforces one rating per user per store.
- Ratings are integers from 1 through 5.
- Passwords are stored as bcrypt hashes, never as plain text.

## Security Notes

- Never commit `.env` files, database files, JWT secrets, or real passwords.
- Use a long, random, environment-specific `JWT_SECRET`.
- Change the seeded admin password outside local development.
- Configure restrictive CORS and HTTPS before public deployment.
- The frontend stores JWTs in `localStorage`; consider an HTTP-only cookie session strategy for a higher-security production deployment.

## Verification

Build and lint the frontend before delivery:

```bash
cd frontend
npm run lint
npm run build
```
