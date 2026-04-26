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
