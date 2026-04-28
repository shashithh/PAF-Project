
# 🏛️ Smart Campus Operations Hub

## 📋 Project Description

Smart Campus Operations Hub is a full-stack web application designed to manage campus facilities, bookings, and maintenance operations. The system provides a centralized platform for handling resources, scheduling, and issue tracking with a structured workflow.

### 🎯 Key Objectives
- 🏢 Manage campus facilities and assets (lecture halls, labs, rooms, equipment)
- 📅 Handle booking requests and prevent scheduling conflicts
- 🔧 Track maintenance issues and ticket progress
- 🔔 Send notifications for bookings and ticket updates
- 🔐 Provide secure authentication and role-based access control

### 💻 Technologies Used
- **Backend**: 🟠 Spring Boot, REST API, JPA/Hibernate, MySQL/PostgreSQL
- **Frontend**: 🔵 React, Axios, Tailwind CSS/Bootstrap
- **Tools**: 🛠️ Git, GitHub, GitHub Actions

---

## 👥 Team Members and Functions

### 1. 👨‍💼 Project Manager
- 📊 Oversee project timeline and deliverables
- 💬 Manage team communications and meetings
- ✅ Track progress and milestones
- 🔗 Coordinate between frontend and backend teams

### 2. 💻 Backend Developer(s)
- 🔌 Design and develop REST API endpoints
- ⚙️ Implement business logic and services
- 🗄️ Set up database schema and manage data
- 🔐 Handle authentication and authorization
- 🧪 Write unit tests for backend services
- 🚀 Deploy and maintain backend infrastructure

### 3. 🎨 Frontend Developer(s)
- 🖼️ Create user interface components
- 📱 Implement responsive design
- 🔗 Integrate with backend APIs
- 🧠 Handle user state management
- 🐛 Test user experience and fix UI bugs
- ⚡ Optimize frontend performance

### 4. 🗄️ Database Administrator
- 📐 Design and optimize database schema
- ⚙️ Manage database connections and configurations
- 📈 Monitor database performance
- 🔒 Handle backups and data security
- ✔️ Ensure data integrity and consistency

### 5. 🧪 QA/Tester
- ✅ Perform functional testing
- 📝 Create test cases for features
- 🌐 Test API endpoints using Postman
- 🐞 Report and document bugs
- 🎯 Perform user acceptance testing

### 6. 🚀 DevOps/System Administrator
- 🔄 Set up CI/CD pipeline with GitHub Actions
- 📦 Manage deployment process
- 📊 Monitor server and application performance
- 🔒 Handle infrastructure and security
- ⚙️ Manage environment configurations

---

## 🚀 Getting Started

### 📋 Prerequisites
- ☕ Java 17+
- 📦 Node.js v18+
- 🗄️ MySQL or PostgreSQL
- 📚 Git

### ⚙️ Backend Setup
```
cd backend
./mvnw spring-boot:run
```

### 🎨 Frontend Setup
```
cd frontend
npm install
npm start
```

### 🗄️ Database Setup
Create a new database and update the connection details in the application.properties file.

---

## ✨ Project Features

**🏢 Facilities Management**
- 🏛️ Manage lecture halls, labs, rooms, and equipment
- 📍 View capacity, location, and availability

**📅 Booking System**
- ✍️ Create booking requests
- 🚫 Prevent scheduling conflicts
- 📊 Track booking status

**🔧 Maintenance Tickets**
- 📝 Report issues with resources
- 📸 Upload images as evidence
- 🔍 Track ticket progress
- 👤 Assign technicians

**🔔 Notifications**
- 📬 Receive updates for bookings and tickets
- 📲 In-app notification system

**🔐 Security**
- 🔑 Secure login system
- 👥 Role-based access control
- 🛡️ Protected routes and APIs

---

## 🌐 API Endpoints

| 📌 Method | 🔗 Endpoint | 📝 Description |
|--------|----------|-------------|
| GET | /api/resources | 📍 Get all resources |
| POST | /api/resources | ➕ Create resource |
| GET | /api/bookings | 📅 Get all bookings |
| POST | /api/bookings | ➕ Create booking |
| PUT | /api/bookings/{id} | ✏️ Update booking |
| DELETE | /api/bookings/{id} | ❌ Cancel booking |
| GET | /api/tickets | 🎫 Get all tickets |
| POST | /api/tickets | ➕ Create ticket |
| PUT | /api/tickets/{id} | ✏️ Update ticket |

---
=======
# 🎓 Smart Campus Operations Hub
**IT3030 PAF Assignment 2026 – Group Project**

A full-stack web platform for managing university facility bookings, maintenance tickets, notifications, and role-based access — built with Spring Boot + React.

---

## 🧩 Modules Implemented
| Module | Description | Status |
|--------|-------------|--------|
| **Module A** | Facilities & Assets Catalogue (CRUD, search, filtering) | ✅ |
| **Module B** | Booking Management (PENDING→APPROVED/REJECTED, conflict check) | ✅ |
| **Module C** | Maintenance & Incident Ticketing (images, comments, workflow) | ✅ |
| **Module D** | Notifications (booking + ticket events, mark read) | ✅ |
| **Module E** | Auth & Authorization (JWT + OAuth2 Google, roles: USER/ADMIN/TECHNICIAN) | ✅ |

---

## 🚀 Quick Start

### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
# H2 console: http://localhost:8080/h2-console
```

**Demo Credentials (auto-seeded):**
| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| User | `john` | `user123` |
| Technician | `tech1` | `tech123` |

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🏗️ Architecture

```
smart-campus-hub/
├── backend/                    # Spring Boot REST API
│   └── src/main/java/com/smartcampus/
│       ├── config/             # SecurityConfig, DataInitializer
│       ├── controller/         # REST controllers (Module A-E)
│       ├── dto/                # Request & Response DTOs
│       ├── entity/             # JPA Entities
│       ├── enums/              # Enumerations
│       ├── repository/         # Spring Data JPA repos
│       ├── security/           # JWT, OAuth2, UserDetails
│       └── service/impl/       # Business logic
└── frontend/                   # React + Vite + TailwindCSS
    └── src/
        ├── components/layout/  # Sidebar
        ├── context/            # AuthContext
        ├── pages/              # All page components
        └── services/           # API service layer
```

---

## 🔌 Key API Endpoints

### Auth
- `POST /api/auth/register` – Register
- `POST /api/auth/login` – Login (returns JWT)
- `GET /oauth2/authorization/google` – Google OAuth2

### Resources (Module A)
- `GET /api/resources?type=&status=&location=&minCapacity=`
- `POST /api/resources` *(ADMIN)*
- `PUT /api/resources/{id}` *(ADMIN)*
- `DELETE /api/resources/{id}` *(ADMIN)*

### Bookings (Module B)
- `POST /api/bookings`
- `GET /api/bookings` *(own / all for ADMIN)*
- `PATCH /api/bookings/{id}/review` *(ADMIN – approve/reject)*
- `PATCH /api/bookings/{id}/cancel`

### Tickets (Module C)
- `POST /api/tickets`
- `GET /api/tickets?status=&category=&priority=`
- `PATCH /api/tickets/{id}/status` *(ADMIN/TECHNICIAN)*
- `POST /api/tickets/{id}/images` *(multipart, max 3)*
- `POST /api/tickets/{id}/comments`
- `PUT /api/tickets/{id}/comments/{cid}`
- `DELETE /api/tickets/{id}/comments/{cid}`
- `GET /api/tickets/analytics` *(ADMIN)*

### Notifications (Module D)
- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `PATCH /api/notifications/{id}/read`
- `PATCH /api/notifications/read-all`

---

## 🗄️ Database

**Default:** H2 In-Memory (dev/demo) – no setup needed  
**Production:** Switch to MySQL in `application.properties`

```properties
# Uncomment these lines in application.properties:
spring.datasource.url=jdbc:mysql://localhost:3306/smart_campus_hub?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=Root@123
spring.jpa.hibernate.ddl-auto=update
```

---

## 🔐 OAuth2 Google Setup
1. Create credentials at https://console.cloud.google.com/
2. Set redirect URI: `http://localhost:8080/login/oauth2/code/google`
3. Add to `application.properties`:
```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
```

---

## 🧪 Testing
- Import `postman_collection.json` from `/docs` into Postman
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:smartcampus`)
>>>>>>> 24eef930c081b159fc375624456fd31be32f4f1c
