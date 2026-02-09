# 📝 Blog Application REST API

A full-featured RESTful Blog API built with **Spring Boot 3.2.5** and **Spring Security** with JWT authentication.

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen?style=flat-square&logo=spring)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6-brightgreen?style=flat-square&logo=springsecurity)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Auth-red?style=flat-square&logo=jsonwebtokens)

## 🚀 Features

- **User Authentication & Authorization** - JWT-based secure authentication
- **User Management** - Register, login, update profile
- **Post Management** - CRUD operations for blog posts
- **Category Management** - Organize posts by categories
- **Comment System** - Add and delete comments on posts
- **Image Upload** - Upload images for blog posts
- **Pagination & Sorting** - Efficient data retrieval
- **Role-Based Access Control** - Admin and User roles
- **Swagger/OpenAPI Documentation** - Interactive API docs

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| **Spring Boot 3.2.5** | Backend Framework |
| **Spring Security 6** | Authentication & Authorization |
| **Spring Data JPA** | Database ORM |
| **MySQL 8** | Relational Database |
| **JWT (jjwt 0.11.5)** | Token-based Authentication |
| **Lombok** | Reduce Boilerplate Code |
| **ModelMapper** | Object Mapping |
| **SpringDoc OpenAPI** | API Documentation |
| **Maven** | Build Tool |

## 📁 Project Structure

```
src/main/java/org/code/
├── BlockAppApiApplication.java    # Main Application
├── config/                        # Configuration Classes
│   ├── SecurityConfig.java        # Spring Security Configuration
│   ├── JacksonConfig.java         # JSON Configuration
│   └── OpenApiConfig.java         # Swagger Configuration
├── controllers/                   # REST Controllers
│   ├── AuthController.java        # Authentication Endpoints
│   ├── UserController.java        # User Management
│   ├── PostController.java        # Post CRUD Operations
│   ├── CategoryController.java    # Category Management
│   └── CommentController.java     # Comment Operations
├── entities/                      # JPA Entities
│   ├── User.java
│   ├── Post.java
│   ├── Category.java
│   ├── Comments.java
│   └── Role.java
├── payload/                       # DTOs & Response Objects
├── repo/                          # JPA Repositories
├── security/                      # Security Components
│   ├── JwtAuthenticationFilter.java
│   ├── JwtTokenHelper.java
│   ├── JwtAuthenticationEntryPoint.java
│   └── CustomUserDetailService.java
├── services/                      # Business Logic
│   └── impl/                      # Service Implementations
└── exceptions/                    # Custom Exception Handling
```

## 🔌 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/register` | User registration |

### 👤 Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/` | Get all users |
| GET | `/api/users/{userId}` | Get user by ID |
| PUT | `/api/users/{userId}` | Update user |
| DELETE | `/api/users/{userId}` | Delete user |

### 📄 Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/` | Get all posts (paginated) |
| GET | `/api/post/{postId}` | Get post by ID |
| POST | `/api/user/{userId}/category/{categoryId}/posts` | Create post |
| PUT | `/api/post/{postId}` | Update post |
| DELETE | `/api/post/{postId}` | Delete post |
| GET | `/api/user/{userId}/posts` | Get posts by user |
| GET | `/api/category/{categoryId}/posts` | Get posts by category |
| POST | `/api/post/image/upload/{postId}` | Upload post image |
| GET | `/api/images/{imageName}` | Get image |

### 📂 Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories/` | Get all categories |
| GET | `/api/categories/{categoryId}` | Get category by ID |
| POST | `/api/categories/` | Create category |
| PUT | `/api/categories/{categoryId}` | Update category |
| DELETE | `/api/categories/{categoryId}` | Delete category |

### 💬 Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts/{postId}/comments` | Add comment |
| DELETE | `/api/comments/{commentId}` | Delete comment |

## ⚙️ Installation & Setup

### Prerequisites
- Java 21+
- Maven 3.8+
- MySQL 8.0+

### 1. Clone the repository
```bash
git clone https://github.com/taksh11982/BlogAppApis.git
cd BlogAppApis/block-app-api
```

### 2. Configure Database
Create a MySQL database:
```sql
CREATE DATABASE `blog-app`;
```

Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blog-app
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Run the Application
```bash
# Using Maven
./mvnw spring-boot:run

# Or build and run JAR
./mvnw clean package
java -jar target/blog-app-api-0.0.1-SNAPSHOT.jar
```

The API will be available at `http://localhost:8081`

### 4. Access Swagger UI
Open your browser and navigate to:
```
http://localhost:8081/swagger-ui.html
```

## 🔒 Security

The API uses **JWT (JSON Web Token)** for authentication:

1. Register a new user via `/api/v1/auth/register`
2. Login via `/api/v1/auth/login` to get JWT token
3. Include the token in subsequent requests:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

### Token Validity
- Tokens are valid for **5 hours**
- After expiration, login again to get a new token

## 📝 Sample API Usage

### Register User
```bash
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "about": "A passionate blogger"
  }'
```

### Login
```bash
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john@example.com",
    "password": "password123"
  }'
```

### Create Post (Authenticated)
```bash
curl -X POST http://localhost:8081/api/user/1/category/1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post."
  }'
```

## 🌐 Deployment

### Environment Variables (Production)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | JDBC connection URL |
| `DATABASE_USERNAME` | Database username |
| `DATABASE_PASSWORD` | Database password |
| `JWT_SECRET` | JWT signing secret (64+ chars) |
| `CORS_ORIGINS` | Allowed frontend origins |
| `PORT` | Server port (default: 8081) |

### Docker
```bash
docker build -t blog-api .
docker run -p 8081:8081 blog-api
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Taksh**
- GitHub: [@taksh11982](https://github.com/taksh11982)

---

⭐ Star this repo if you find it helpful!
