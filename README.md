# mmtm

## Mindmirror task manager

#### v1.0

A task management application that adapts to your mood using AI-powered mood detection and intelligent task reorganization.

## Features

- 🧠 **AI-Powered Mood Detection**: Analyzes your text input to determine your current mood
- 📋 **Smart Task Reorganization**: Automatically reorganizes tasks based on your detected mood
- 📊 **Multiple Views**: List, Calendar, Timeline, and Reports views
- 📈 **Analytics & Reports**: Track your productivity and task completion rates
- and much more !

## Mood-Based Task Organization

- **Tired**: Prioritizes easier (low priority) tasks
- **Energetic**: Prioritizes harder (high priority) tasks
- **Focused**: Prioritizes important tasks by importance score
- **Stressed**: Prioritizes tasks with approaching deadlines
- **Happy**: Balances task difficulty and importance

## Installation

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

For support, please open an issue on GitHub or contact samin from spaciery.
