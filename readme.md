# 🔗 LinkForge

> A modern, secure, and scalable URL shortening platform built with the MERN stack, featuring JWT authentication, Redis caching, URL expiration, analytics, and cloud deployment.

🌐 **Live Demo:** https://linkforge-mocha.vercel.app

🚀 **Backend API:** https://linkforge-backend-7xib.onrender.com

---

## 📖 Overview

**LinkForge** is a full-stack URL shortening application that enables users to securely create, manage, and analyze shortened URLs. The application incorporates industry-standard authentication, cloud-hosted infrastructure, Redis-powered caching, and responsive UI design to deliver a fast and reliable experience.

---

## ✨ Features

### 🔐 Authentication

* User Registration & Login
* JWT Access & Refresh Tokens
* HTTP-only Secure Cookies
* Automatic Access Token Refresh
* Protected Routes
* Secure Logout

### 🔗 URL Management

* Shorten Long URLs
* Custom URL Aliases
* Personal Dashboard
* Delete URLs
* Click Tracking

### ⏳ URL Expiration

* Configurable Expiration Time
* Automatic Expiry Validation
* Active / Expired Status
* Dynamic Redis Cache TTL

### 📊 Analytics

* Total Clicks
* Original URL
* Short URL
* Creation Time
* Expiration Time
* Active Status

### ⚡ Performance

* Redis Caching
* Upstash Cloud Redis
* Dynamic Cache Expiration
* Reduced Database Queries

### 🛡 Security

* Redis Rate Limiting
* JWT Authentication
* Password Hashing with bcrypt
* Secure Cookie Authentication
* CORS Protection

### ☁ Cloud Deployment

* Frontend deployed on Vercel
* Backend deployed on Render
* MongoDB Atlas
* Upstash Redis

---

# 🏗 Architecture

```
                React + Vite
                     │
                     │ HTTPS
                     ▼
            Express.js REST API
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
 MongoDB Atlas             Upstash Redis
(User & URL Data)       (Cache & Rate Limit)
```

---

# 🛠 Tech Stack

## Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Tailwind CSS
* React Hot Toast

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Redis
* nanoid

## Cloud Services

* MongoDB Atlas
* Upstash Redis
* Render
* Vercel

---

# 📂 Project Structure

```
LinkForge
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── db
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   ├── utils
│   │   └── app.js
│   └── package.json
│
└── frontend
    ├── src
    │   ├── api
    │   ├── components
    │   ├── pages
    │   └── routes
    └── package.json
```

---

# 🔐 Authentication Flow

```
Login
   │
   ▼
Access Token (15 min)
Refresh Token (7 days)
   │
   ▼
HTTP-only Cookies
   │
   ▼
Protected Routes
   │
   ▼
Automatic Token Refresh
```

---

# ⚡ Redis Integration

Redis is used for:

* URL Redirect Caching
* Dynamic Cache TTL
* API Rate Limiting

This minimizes database hits and improves redirect performance.

---

# 📊 Analytics

Each shortened URL provides:

* Original URL
* Short URL
* Total Clicks
* Created Date
* Expiration Date
* Active / Expired Status

---

# 🚀 API Endpoints

## Authentication

| Method | Endpoint                      |
| ------ | ----------------------------- |
| POST   | `/api/v1/users/register`      |
| POST   | `/api/v1/users/login`         |
| POST   | `/api/v1/users/logout`        |
| POST   | `/api/v1/users/refresh-token` |
| GET    | `/api/v1/users/current-user`  |

---

## URL

| Method | Endpoint                            |
| ------ | ----------------------------------- |
| POST   | `/api/v1/urls/create`               |
| GET    | `/api/v1/urls/my-urls`              |
| DELETE | `/api/v1/urls/:shortCode`           |
| GET    | `/api/v1/urls/analytics/:shortCode` |
| GET    | `/:shortCode`                       |

---




# 🌐 Deployment

| Service  | Platform      |
| -------- | ------------- |
| Frontend | Vercel        |
| Backend  | Render        |
| Database | MongoDB Atlas |
| Cache    | Upstash Redis |

---

# 🚀 Future Improvements

* QR Code Generation
* Visitor Analytics
* Geo-location Tracking
* Browser & Device Analytics
* Click History Charts
* Search & Filters
* Pagination
* Export Analytics (CSV)
* Custom Domains
* Swagger API Documentation
* Unit & Integration Tests

---

# 👨‍💻 Author

**Shivam Sachan**


