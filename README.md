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
