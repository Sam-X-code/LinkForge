# 🚀 LinkForge

> A modern, secure, and **distributed URL shortening platform** built with the MERN stack, featuring **JWT authentication, Redis caching, RabbitMQ-powered asynchronous analytics, Nginx load balancing, Dockerized microservices, URL expiration, and cloud deployment.**

🌐 **Live Demo:** https://linkforge-mocha.vercel.app

🚀 **Backend API:** https://linkforge-backend-7xib.onrender.com

---

## 📖 Overview

**LinkForge** is a production-inspired distributed URL shortening platform that enables users to securely create, manage, and analyze shortened URLs. The application leverages **stateless backend services**, **Redis caching**, **RabbitMQ event-driven processing**, **Nginx load balancing**, and **Docker Compose orchestration** to deliver a scalable and responsive system.

---

# ✨ Features

### 🔐 Authentication

- User Registration & Login
- JWT Access & Refresh Tokens
- HTTP-only Secure Cookies
- Protected Routes
- Secure Logout

### 🔗 URL Management

- Shorten Long URLs
- Custom URL Aliases
- Personal Dashboard
- Delete URLs
- Click Tracking

### ⏳ URL Expiration

- Configurable Expiration Time
- Automatic Expiry Validation
- Active / Expired Status
- Dynamic Redis Cache TTL

### 📊 Analytics

- Total Clicks
- Original URL
- Short URL
- Creation Time
- Expiration Time
- Active Status
- Asynchronous Click Processing via RabbitMQ

### ⚡ Performance

- Redis URL Caching
- Upstash Cloud Redis
- Dynamic Cache Expiration
- Reduced MongoDB Queries
- Background Analytics Worker

### 🌐 Distributed Architecture

- Nginx Reverse Proxy
- Load Balancing across 3 Backend Instances
- Stateless Express Services
- RabbitMQ Event Queue
- Docker Compose Orchestration
- Health Monitoring Endpoint

### 🛡 Security

- Redis Rate Limiting
- JWT Authentication
- Password Hashing using bcrypt
- Secure HTTP-only Cookies
- CORS Protection

### ☁ Cloud Deployment

- Frontend deployed on Vercel
- Backend deployed on Render
- MongoDB Atlas
- Upstash Redis

---

# 🏗 Architecture

```text
                           Client
                              │
                         HTTPS Request
                              │
                        Nginx Load Balancer
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
    Backend-1            Backend-2            Backend-3
         │                    │                    │
         └──────── Publish Click Event ────────────┘
                              │
                         RabbitMQ Queue
                              │
                              ▼
                     Analytics Worker
                              │
                              ▼
                        MongoDB Atlas
                              ▲
                              │
                       Upstash Redis
```

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Hot Toast

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Redis
- RabbitMQ
- Nginx
- nanoid

## DevOps

- Docker
- Docker Compose
- Nginx
- RabbitMQ

## Cloud Services

- MongoDB Atlas
- Upstash Redis
- Render
- Vercel

---

# 📂 Project Structure

```text
LinkForge
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── queues
│   │   ├── workers
│   │   ├── routes
│   │   ├── utils
│   │   ├── app.js
│   │   └── index.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   └── routes
│   └── package.json
│
├── nginx
│   └── nginx.conf
│
├── docker-compose.yml
│
└── README.md
```

---

# 🔐 Authentication Flow

```text
User Login
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
```

---

# ⚡ Redis Integration

Redis is used for:

- URL Redirect Caching
- Dynamic Cache TTL
- IP-based Rate Limiting

This significantly reduces MongoDB queries and improves redirect performance.

---

# 📨 RabbitMQ Event Processing

Each redirect request immediately publishes a click event to RabbitMQ instead of updating MongoDB synchronously.

```text
Redirect Request
       │
       ▼
Publish Click Event
       │
       ▼
RabbitMQ Queue
       │
       ▼
Analytics Worker
       │
       ▼
MongoDB Click Counter
```

This event-driven architecture enables fast redirects while processing analytics asynchronously.

---

# ❤️ Health Monitoring

Each backend instance exposes:

```text
GET /health
```

which reports:

- Backend Instance
- MongoDB Status
- Redis Status
- RabbitMQ Status
- Server Uptime

This endpoint can be used by monitoring systems and load balancers to verify application health.

---

# 🚀 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/v1/users/register` |
| POST | `/api/v1/users/login` |
| POST | `/api/v1/users/logout` |
| POST | `/api/v1/users/refresh-token` |
| GET | `/api/v1/users/current-user` |

---

## URL

| Method | Endpoint |
|---------|----------|
| POST | `/api/v1/urls/create` |
| GET | `/api/v1/urls/my-urls` |
| DELETE | `/api/v1/urls/:shortCode` |
| GET | `/api/v1/urls/analytics/:shortCode` |
| GET | `/:shortCode` |

---

## Monitoring

| Method | Endpoint |
|---------|----------|
| GET | `/health` |

---

# 🌐 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Cache | Upstash Redis |

---

# 👨‍💻 Author

**Shivam Sachan**
