# BlogApp Frontend

A modern, interactive React frontend for the BlogApp API built with Vite, Tailwind CSS, and React Router.

## Features

- 🎨 **Modern UI** - Clean, responsive design with smooth animations
- 🔐 **JWT Authentication** - Secure login/register with token management
- 📝 **Blog Posts** - Create, read, update, delete posts with image upload
- 💬 **Comments** - Interactive comment system
- 📂 **Categories** - Organize posts by categories
- 🔍 **Search & Filter** - Search posts and filter by category
- 📱 **Responsive** - Works on all device sizes
- 👤 **User Dashboard** - Manage your posts and profile

## Tech Stack

- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router v6** - Navigation
- **Axios** - HTTP Client
- **React Icons** - Icons
- **React Toastify** - Notifications
- **date-fns** - Date formatting

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PostCard.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/          # React Context
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Posts.jsx
│   │   ├── PostDetail.jsx
│   │   ├── CreatePost.jsx
│   │   ├── Categories.jsx
│   │   ├── Profile.jsx
│   │   └── Dashboard.jsx
│   ├── services/         # API services
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:8080`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## API Endpoints Used

The frontend communicates with these backend endpoints:

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### Users
- `GET /api/users/` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (Admin)

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/post/{id}/posts` - Get post by ID
- `GET /api/user/{userId}/posts` - Get posts by user
- `GET /api/category/{categoryId}/posts` - Get posts by category
- `POST /api/user/{userId}/category/{categoryId}/posts` - Create post
- `PUT /api/post/{id}` - Update post
- `DELETE /api/post/{id}` - Delete post
- `GET /api/post/search/{keyword}` - Search posts
- `POST /api/post/image/upload/{postId}` - Upload post image
- `GET /api/images/{imageName}` - Get image

### Categories
- `GET /api/categories/` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories/` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Comments
- `POST /api/posts/{postId}/comments` - Create comment
- `DELETE /api/comments/{commentId}` - Delete comment

## CORS Configuration

Make sure your backend has CORS enabled for `http://localhost:3000`. Add to your Spring Security config:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

## Screenshots

### Home Page
- Hero section with call-to-action
- Featured categories
- Latest posts grid

### Posts Page
- Search and filter functionality
- Pagination
- Category filtering

### Post Detail
- Full post content
- Comments section
- Author info

### Dashboard
- User statistics
- Post management table
- Quick actions

## License

MIT License
