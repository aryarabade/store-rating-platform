# ⭐ StoreRate

> **Discover stores. Share experiences. Make better choices.**

StoreRate is a full-stack store rating platform where users can discover stores, search by name or address, view ratings, and submit or update ratings. Administrators manage users and stores, while store owners can monitor their store's rating performance.

---

## 🚀 Features

- 🔐 JWT authentication with bcrypt password hashing
- 👥 Role-based access: **User · Store Owner · Admin**
- 🏪 Search stores by name and address
- ⭐ Submit and update **1–5 star ratings**
- 📊 Average rating & rating history
- 🛠️ Admin dashboard with platform statistics
- 👤 Admin user management
- 🏬 Admin store management & owner assignment
- 📈 Store-owner rating dashboard
- 🔑 Secure password updates
- 📱 Responsive UI for desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router |
| Styling | CSS |
| Backend | Node.js, Express 4 |
| Database | SQLite / MySQL |
| ORM | Sequelize |
| Authentication | JWT |
| Security | bcryptjs |
| HTTP Client | Axios |

---

## 🏗️ Architecture

```text
┌─────────────────┐
│   React + Vite  │
│    Frontend     │
└────────┬────────┘
         │ Axios / REST API
         ▼
┌─────────────────┐
│ Node.js Express │
│     Backend     │
└────────┬────────┘
         │ Sequelize
         ▼
┌─────────────────┐
│ SQLite / MySQL  │
│    Database     │
└─────────────────┘
