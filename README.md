# MMTM - Mood-Based Task Management

A full-stack task management application that adapts to your mood using AI-powered mood detection and intelligent task reorganization.

## Features

- 🧠 **AI-Powered Mood Detection**: Analyzes your text input to determine your current mood
- 📋 **Smart Task Reorganization**: Automatically reorganizes tasks based on your detected mood
- 📊 **Multiple Views**: List, Calendar, Timeline, and Reports views
- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🌙 **Dark/Light Mode**: Toggle between themes
- 📈 **Analytics & Reports**: Track your productivity and task completion rates

## Mood-Based Task Organization

- **Tired**: Prioritizes easier (low priority) tasks
- **Energetic**: Prioritizes harder (high priority) tasks
- **Focused**: Prioritizes important tasks by importance score
- **Stressed**: Prioritizes tasks with approaching deadlines
- **Happy**: Balances task difficulty and importance

## Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Hooks for state management

### Backend
- Go with Gin web framework
- PostgreSQL database
- JWT authentication
- OpenAI API integration (optional)
- RESTful API design

## Quick Start

### Prerequisites
- Node.js 18+
- Go 1.21+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Option 1: Docker Compose (Recommended)

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd mmtm
\`\`\`

2. Start all services:
\`\`\`bash
docker-compose up -d
\`\`\`

3. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5432

### Option 2: Manual Setup

#### Database Setup
1. Install PostgreSQL and create a database:
\`\`\`sql
CREATE DATABASE mmtm_db;
CREATE USER mmtm_user WITH ENCRYPTED PASSWORD 'mmtm_password';
GRANT ALL PRIVILEGES ON DATABASE mmtm_db TO mmtm_user;
\`\`\`

2. Run the initialization script:
\`\`\`bash
psql -U mmtm_user -d mmtm_db -f scripts/init-database.sql
\`\`\`

#### Backend Setup
1. Navigate to the backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
go mod download
\`\`\`

3. Create a `.env` file:
\`\`\`env
DB_HOST=localhost
DB_PORT=5432
DB_USER=mmtm_user
DB_PASSWORD=mmtm_password
DB_NAME=mmtm_db
DB_SSLMODE=disable
JWT_SECRET=your-super-secure-jwt-secret-key
OPENAI_API_KEY=your-openai-api-key-here
PORT=8080
\`\`\`

4. Run the backend:
\`\`\`bash
go run main.go
\`\`\`

#### Frontend Setup
1. Navigate to the project root:
\`\`\`bash
cd ..
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env.local` file:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
\`\`\`

4. Run the frontend:
\`\`\`bash
npm run dev
\`\`\`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Task Endpoints
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/reorganize` - Reorganize tasks based on mood

### Mood Analysis Endpoints
- `POST /api/mood/analyze` - Analyze mood from text input

### User Endpoints
- `GET /api/user` - Get user profile
- `PUT /api/user` - Update user profile

## Environment Variables

### Backend (.env)
\`\`\`env
DB_HOST=localhost
DB_PORT=5432
DB_USER=mmtm_user
DB_PASSWORD=mmtm_password
DB_NAME=mmtm_db
DB_SSLMODE=disable
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key (optional)
PORT=8080
GIN_MODE=release
\`\`\`

### Frontend (.env.local)
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
\`\`\`

## Database Schema

### Users Table
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR UNIQUE)
- `email` (VARCHAR UNIQUE)
- `password_hash` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

### Tasks Table
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER FOREIGN KEY)
- `title`, `description` (VARCHAR/TEXT)
- `category`, `priority`, `status` (VARCHAR)
- `due_date` (TIMESTAMP)
- `importance` (INTEGER 1-10)
- `progress` (INTEGER 0-100)
- `reorganizable`, `strict` (BOOLEAN)
- `notes` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

### Mood Logs Table
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER FOREIGN KEY)
- `mood` (VARCHAR)
- `confidence` (FLOAT)
- `text_input` (TEXT)
- `created_at` (TIMESTAMP)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Demo Account

For testing purposes, a demo account is created automatically:
- Email: demo@example.com
- Password: password

## Support

For support, please open an issue on GitHub or contact the development team.
