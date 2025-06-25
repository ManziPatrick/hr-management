# HR Management System

A comprehensive HR management system with React frontend and Node.js backend, featuring candidate management, job postings, and employee tracking.

## Features

### Frontend (React + TypeScript)
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Authentication**: Secure login/signup with JWT tokens
- **Dashboard**: Real-time overview of HR metrics
- **Candidate Management**: View, search, and manage job candidates
- **Job Management**: Create and manage job postings
- **Employee Management**: Track current employees
- **Profile Management**: User profile and settings
- **Mobile Responsive**: Works on all device sizes

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Complete CRUD operations for all entities
- **Authentication**: JWT-based authentication with password hashing
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Input validation and error handling
- **Security**: CORS, rate limiting, and security middleware
- **Email Integration**: Password reset and email verification (configured)

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- nodemailer
- express-rate-limit
- helmet

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hr-management-main
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/hr-management
   JWT_SECRET=your-super-secret-jwt-key
   PORT=4000
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

5. **Database Setup**
   ```bash
   cd backend
   node src/utils/seed.js
   ```

6. **Start the Backend**
   ```bash
   cd backend
   node src/server.js
   ```

7. **Start the Frontend**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Candidates
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate by ID
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate
- `PATCH /api/candidates/:id/status` - Update candidate status
- `GET /api/candidates/stats/overview` - Get candidate statistics

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `PATCH /api/jobs/:id/status` - Update job status
- `GET /api/jobs/stats/overview` - Get job statistics

## Default Users

The seed script creates the following users:

| Email | Password | Role |
|-------|----------|------|
| alice.hr@example.com | Password123 | HR |
| bob.hr@example.com | Password123 | HR |
| carol.hr@example.com | Password123 | HR |
| david.admin@example.com | Password123 | Admin |

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (HR/Admin),
  isVerified: Boolean,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

### Candidate Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  position: String,
  location: String,
  status: String,
  experience: String,
  skills: [String],
  education: [Object],
  workHistory: [Object],
  salary: Number,
  availability: String,
  notes: String,
  tags: [String],
  source: String
}
```

### Job Model
```javascript
{
  title: String,
  department: String,
  location: String,
  type: String,
  status: String,
  applications: Number,
  description: String,
  requirements: [String],
  responsibilities: [String],
  benefits: [String],
  salary: Object,
  experience: Object,
  skills: [String],
  remote: Boolean,
  applicationDeadline: Date,
  hiringManager: Object,
  tags: [String],
  isUrgent: Boolean
}
```

## Features in Detail

### Dashboard
- Real-time statistics for candidates and jobs
- Overview cards with visual indicators
- Jobs requiring attention
- Upcoming meetings (mock data)

### Candidate Management
- View all candidates with filtering and search
- Candidate status tracking
- Detailed candidate profiles
- Statistics and analytics

### Job Management
- Create and manage job postings
- Track applications and status
- Department-based organization
- Application deadline management

### Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- Email verification (configured)
- Password reset functionality

## Development

### Project Structure
```
hr-management-main/
├── src/                    # Frontend source
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── ...
├── backend/               # Backend source
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── utils/         # Utility functions
│   │   └── ...
│   └── ...
└── ...
```

### Adding New Features
1. Create backend model and controller
2. Add API routes
3. Create frontend service
4. Build UI components
5. Add to navigation

## Deployment

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or similar

### Backend
- Deploy to Heroku, Railway, or similar
- Set environment variables
- Connect to MongoDB Atlas

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@example.com or create an issue in the repository.