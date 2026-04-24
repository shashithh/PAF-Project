# Merge Guide — Module A + Module B

This document describes exactly what to do when merging the two branches on GitHub.
Follow these steps **after** the pull request is created and before you click "Merge".

---

## Overview of what each module owns

| | Module A (Facilities) | Module B (Booking) |
|---|---|---|
| Package | `com.smartcampus.facilities` | `com.smartcampus.booking` |
| Port | 8080 | 5000 |
| MongoDB collections | `resources` | `bookings` |
| Security | HTTP Basic Auth (SecurityConfig) | Open (permissive SecurityConfig) |
| Frontend | Tailwind + axios + login page | Plain CSS + lucide-react + mock switcher |

---

## Backend merge steps

### 1. Port — pick one
In `application.properties`, keep **one** `server.port` line:
```properties
server.port=8080
```
Delete Module B's `server.port=5000` line.

### 2. Delete Module B's SecurityConfig
**Delete this file:**
```
backend/src/main/java/com/smartcampus/config/SecurityConfig.java
```
Module A's `SecurityConfig` (`com.smartcampus.facilities.security.SecurityConfig`) takes over.

### 3. Update Module A's CORS to include Module B's frontend
In `com.smartcampus.facilities.security.SecurityConfig`, find `corsConfigurationSource()` and update:
```java
config.setAllowedOrigins(List.of(
    "http://localhost:8021",   // Module A frontend
    "http://localhost:5173",   // Module B frontend
    "http://localhost:3000"    // fallback
));
```

### 4. Delete Module B's CorsConfig (optional)
Once Module A's SecurityConfig handles CORS, this file is redundant:
```
backend/src/main/java/com/smartcampus/config/CorsConfig.java
```

### 5. No conflict on exception handlers
- Module A: `com.smartcampus.facilities.exception.GlobalExceptionHandler`
- Module B: `com.smartcampus.booking.BookingExceptionHandler` (scoped to booking package)
These coexist — no action needed.

### 6. No conflict on Resource entity
- Module A owns `com.smartcampus.facilities.entity.Resource` (full model)
- Module B has `com.smartcampus.resource.Resource` (thin read-only projection)
Both map to the same `resources` MongoDB collection.
After merge, Module B's `ResourceController` and `ResourceRepository` can optionally
be deleted and replaced with Module A's richer endpoints — but it is NOT required.
The booking flow will continue to work with Module B's thin resource model.

### 7. application.properties — keep one merged file

**Database decision: use Module B's cluster (`cluster0.perzjxk`).**

Module A was using a different cluster (`unilife.fkbmznz`) with no database name set.
After merge, both modules point to the same cluster and database so the `resources`
collection (written by Module A) and `bookings` collection (written by Module B)
live together in one place.

**Tell Member A to update their URI to this before merging.**

```properties
server.port=8080
spring.application.name=smart-campus
spring.data.mongodb.uri=mongodb+srv://admin:root@cluster0.perzjxk.mongodb.net/lecture_booking?retryWrites=true&w=majority
logging.level.com.smartcampus=DEBUG
logging.level.org.springframework.data.mongodb=DEBUG
logging.level.org.springframework.security=DEBUG
```

> **Note for Member A:** Your original URI was:
> `mongodb+srv://admin:root@unilife.fkbmznz.mongodb.net/?appName=unilife`
> Replace it with the URI above. Also make sure your Atlas cluster (`cluster0.perzjxk`)
> has IP `0.0.0.0/0` whitelisted so both team members can connect.

### 8. Lombok — already in pom.xml
Module B's `pom.xml` already includes Lombok and Spring Security dependencies.
No changes needed to `pom.xml`.

---

## Frontend merge steps

The two frontends are separate apps and do NOT need to be merged into one.
They run on different ports and call the same backend.

| | Module A frontend | Module B frontend |
|---|---|---|
| Port | 8021 | 5173 |
| Styling | Tailwind CSS | Plain CSS + CSS variables |
| Auth | Login page → Basic Auth header | Mock user switcher |
| API base | `http://localhost:8080` (direct) | `/api` (Vite proxy → 5000, change to 8080) |

### Only one frontend change needed after merge:
In `frontend/vite.config.js`, update the proxy target from `5000` to `8080`:
```js
proxy: {
  '/api': {
    target: 'http://localhost:8080',  // was 5000
    changeOrigin: true,
  },
},
```

---

## What works automatically (no changes needed)

- Both `@SpringBootApplication` scans — Module B's main class scans `com.smartcampus.*`
  which covers both `com.smartcampus.booking` and `com.smartcampus.facilities`
- MongoDB — both modules use the same Atlas cluster and database (`lecture_booking`)
- `resources` collection — Module B's seed data already writes Module A compatible fields
  (`resourceCode`, `resourceName`, `resourceType`, `location`, `status`)
- No duplicate bean names — all class names are unique across both modules

---

## Checklist

- [ ] Merge PR on GitHub
- [ ] Change `server.port` to `8080`
- [ ] Delete `com.smartcampus.config.SecurityConfig` (Module B's permissive one)
- [ ] Add `localhost:5173` to Module A's CORS allowed origins
- [ ] Update `vite.config.js` proxy target to `8080`
- [ ] Run `mvn spring-boot:run` — one process serves both modules
- [ ] Test `GET /api/resources` — returns resources (Module B endpoint)
- [ ] Test `GET /api/bookings` — returns bookings (Module B endpoint)
- [ ] Test Module A's `POST /api/resources` with admin credentials
- [ ] Test Module B's booking flow end-to-end
