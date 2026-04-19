# Smart Campus Booking System

A full-stack campus resource booking application.

| Layer    | Technology                        | Port  |
|----------|-----------------------------------|-------|
| Frontend | React 19 + Vite + React Router    | 5173  |
| Backend  | Spring Boot 3 + JPA + H2 (dev)    | 8080  |

---

## Project structure

```
smart-campus/
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
│
├── backend/           # Spring Boot REST API
│   ├── src/main/java/com/smartcampus/
│   │   ├── SmartCampusApplication.java
│   │   ├── booking/       # Entity, Repo, Service, Controller, DTOs
│   │   └── config/        # CORS
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql       # Dev seed data
│   └── pom.xml
│
└── README.md
```

---

## Getting started

### Prerequisites
- Node.js ≥ 18
- Java 21+
- Maven 3.9+

### Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API is available at `http://localhost:8080/api`.  
H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:smartcampus`)

### Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app is available at `http://localhost:5173`.  
API calls to `/api/*` are proxied to `http://localhost:8080` automatically.

### Build for production

```bash
# Backend — produces backend/target/smart-campus-backend-*.jar
cd backend && mvn clean package

# Frontend — produces frontend/dist/
cd frontend && npm run build
```

---

## API endpoints

| Method | Path                          | Description                  |
|--------|-------------------------------|------------------------------|
| GET    | `/api/bookings`               | All bookings (admin)         |
| GET    | `/api/bookings?userId={id}`   | Bookings for one user        |
| POST   | `/api/bookings`               | Create a booking             |
| PATCH  | `/api/bookings/{id}/status`   | Approve / reject / cancel    |

---

## Connecting frontend to backend

The frontend currently uses mock data in `src/data/mockBookings.js` and a simulated service in `src/services/bookingService.js`.

To switch to the real API, replace the mock bodies in `bookingService.js`:

```js
// fetchBookings
export async function fetchBookings() {
  return fetch('/api/bookings').then(r => r.json())
}

// submitBooking
export async function submitBooking(booking) {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  })
  if (!res.ok) throw new Error((await res.json()).message ?? `Error ${res.status}`)
  return res.json()
}
```
