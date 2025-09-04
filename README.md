# Movie App

A full-stack web application for managing and browsing movies. Users can submit movies for approval, and admins can approve them. The app features user authentication, movie CRUD operations, and image uploads.

## Features

- User registration and authentication (JWT-based)
- Movie submission and management
- Admin approval system for movies
- Image upload for movie posters
- Responsive UI with Bootstrap
- Role-based access control (User/Admin)

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

### Frontend
- React 19
- Vite
- React Router
- Axios for API calls
- Bootstrap 5 for styling

## Setup Instructions

### Local Development

#### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

#### Backend Setup
1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/movieapp
   JWT_SECRET=your_jwt_secret_here
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on http://localhost:5000

#### Frontend Setup
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
   The app will run on http://localhost:5173

#### Database Setup
1. Ensure MongoDB is running locally or update the MONGODB_URI in `.env` for a cloud instance.
2. The app will automatically create collections and indexes when you start the server.

### Docker Setup

#### Prerequisites
- Docker
- Docker Compose

#### Running with Docker
1. Ensure you have Docker and Docker Compose installed.

2. Create a `docker-compose.yml` file in the root directory:
   ```yaml
   version: '3.8'
   services:
     mongodb:
       image: mongo:latest
       ports:
         - "27017:27017"
       environment:
         MONGO_INITDB_DATABASE: movieapp
       volumes:
         - mongodb_data:/data/db

     backend:
       build: ./Backend
       ports:
         - "5000:5000"
       environment:
         MONGODB_URI: mongodb://mongodb:27017/movieapp
         JWT_SECRET: your_jwt_secret_here
       depends_on:
         - mongodb
       volumes:
         - ./Backend/uploads:/app/uploads

     frontend:
       build: ./frontend
       ports:
         - "5173:5173"
       depends_on:
         - backend

   volumes:
     mongodb_data:
   ```

3. Create a `Dockerfile` for the backend in `Backend/Dockerfile`:
   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

4. Create a `Dockerfile` for the frontend in `frontend/Dockerfile`:
   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 5173
   CMD ["npm", "run", "dev"]
   ```

5. Run the application:
   ```bash
   docker-compose up --build
   ```

6. Access the app at http://localhost:5173

## Database Schema

### User Model
```javascript
{
  username: String (required, unique, 3-20 chars),
  email: String (required, unique),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Movie Model
```javascript
{
  title: String (required),
  type: String (enum: ['movie', 'show'], required),
  director: String,
  budget: Number (min: 0),
  location: String,
  duration: Number (min: 0),
  year: Number (min: 1800, max: current year),
  description: String,
  poster: String (path to uploaded image),
  createdBy: ObjectId (ref: 'User', required),
  approved: Boolean (default: false),
  isDeleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Database Migration
Since this is a NoSQL MongoDB application, there are no traditional migrations. The schemas are defined in the model files and will be applied when the application starts. Make sure to backup your data before deploying to production.

## API Documentation

The API follows RESTful conventions. All endpoints require authentication except signup and login.

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Movie Endpoints
- `GET /api/movies` - Get all movies (with optional filters)
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create new movie (with poster upload)
- `PUT /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Soft delete movie
- `PUT /api/movies/:id/approve` - Approve movie (admin only)

### User Endpoints
- `GET /api/users` - List all users (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `PUT /api/users/profile` - Update own profile

### API Documentation Link
For detailed API documentation with examples, you can use tools like Postman or Swagger. Import the following collection into Postman:

[Postman Collection Link - To be added]

## Testing

### Running Tests
Currently, there are no automated tests implemented. To manually test the application:

1. Start the backend and frontend servers
2. Test user registration and login
3. Create, read, update, and delete movies
4. Test admin approval functionality
5. Verify image upload and display

### Test Coverage
- Unit tests for models and controllers (not implemented)
- Integration tests for API endpoints (not implemented)
- End-to-end tests for user flows (not implemented)

## CI/CD Instructions

CI/CD is not currently implemented. To set up CI/CD:

1. Choose a CI/CD platform (GitHub Actions, Jenkins, etc.)
2. Create a pipeline that:
   - Installs dependencies
   - Runs tests (when implemented)
   - Builds the application
   - Deploys to staging/production

Example GitHub Actions workflow:
```yaml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

## Demo Credentials

For testing purposes, you can use the following demo accounts:

### Admin Account
- Username: admin
- Email: admin@gmail.com
- Password: admin123

### Regular User Account
- Username: Luke
- Email: luke@gmail.com
- Password: luke123

*Note: These accounts may not exist in your database. You can create them through the signup process or directly in the database.*

## Live Demo

A live demo is not currently available. To see the application in action, follow the local setup instructions above.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
