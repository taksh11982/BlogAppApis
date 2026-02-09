# 📝 Blog Application - Full Stack

A complete Blog Application with **Spring Boot REST API** backend and **React** frontend.

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen?style=flat-square&logo=spring)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Auth-red?style=flat-square&logo=jsonwebtokens)

---

## 🚀 Features

### Backend (Spring Boot)
- JWT-based Authentication & Authorization
- User Management (Register, Login, Update Profile)
- Post Management (CRUD with Image Upload)
- Category Management
- Comment System
- Pagination & Sorting
- Role-Based Access Control
- Swagger/OpenAPI Documentation

### Frontend (React)
- Modern UI with Tailwind CSS
- Responsive Design
- User Authentication Flow
- Post Creation with Image Upload
- Category Filtering
- Comment System
- User Dashboard

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Spring Boot 3.2.5, Spring Security 6, Spring Data JPA |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6 |
| **Database** | MySQL 8 |
| **Authentication** | JWT (JSON Web Tokens) |
| **API Docs** | SpringDoc OpenAPI / Swagger |

---

## 📁 Project Structure

```
BlogAppApis/
├── block-app-api/          # Spring Boot Backend
│   ├── src/main/java/org/code/
│   │   ├── controllers/    # REST Controllers
│   │   ├── entities/       # JPA Entities
│   │   ├── services/       # Business Logic
│   │   ├── security/       # JWT & Auth
│   │   └── config/         # Configuration
│   └── pom.xml
│
└── frontend/               # React Frontend
    ├── src/
    │   ├── components/     # Reusable Components
    │   ├── pages/          # Page Components
    │   ├── context/        # Auth Context
    │   └── services/       # API Services
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8+
- Maven 3.8+

### 1. Clone the Repository
```bash
git clone https://github.com/taksh11982/BlogAppApis.git
cd BlogAppApis
```

### 2. Setup Database
```sql
CREATE DATABASE `blog-app`;
```

### 3. Configure Backend
Update `block-app-api/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blog-app
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 4. Run Backend
```bash
cd block-app-api
./mvnw spring-boot:run
```
Backend runs at: `http://localhost:8081`

### 5. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:3000`

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/register` | User registration |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/` | Get all posts |
| GET | `/api/post/{id}` | Get post by ID |
| POST | `/api/user/{userId}/category/{catId}/posts` | Create post |
| PUT | `/api/post/{id}` | Update post |
| DELETE | `/api/post/{id}` | Delete post |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories/` | Get all categories |
| POST | `/api/categories/` | Create category |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts/{postId}/comments` | Add comment |
| DELETE | `/api/comments/{id}` | Delete comment |

---

## 🔒 Authentication

1. Register: `POST /api/v1/auth/register`
2. Login: `POST /api/v1/auth/login` → Returns JWT token
3. Use token in headers: `Authorization: Bearer <token>`

---

## 📸 Screenshots

*Add your screenshots here*

---

## 👤 Author

**Taksh**
- GitHub: [@taksh11982](https://github.com/taksh11982)

---

⭐ Star this repo if you find it helpful!
Creating a sample project for learning springboot only backend project.
