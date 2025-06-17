-- Create database and user
CREATE DATABASE mmtm_db;
CREATE USER mmtm_user WITH ENCRYPTED PASSWORD 'mmtm_password';
GRANT ALL PRIVILEGES ON DATABASE mmtm_db TO mmtm_user;

-- Connect to the database
\c mmtm_db;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO mmtm_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mmtm_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mmtm_user;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Todo', 'In Progress', 'Completed')),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    importance INTEGER NOT NULL CHECK (importance >= 1 AND importance <= 10),
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    reorganizable BOOLEAN NOT NULL DEFAULT true,
    strict BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mood_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    mood VARCHAR(50) NOT NULL CHECK (mood IN ('Happy', 'Tired', 'Stressed', 'Focused', 'Energetic')),
    confidence FLOAT NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    text_input TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_mood_logs_user_id ON mood_logs(user_id);
CREATE INDEX idx_mood_logs_created_at ON mood_logs(created_at);

-- Insert sample data for testing
INSERT INTO users (username, email, password_hash) VALUES 
('demo_user', 'demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password: password

-- Get the demo user ID
DO $$
DECLARE
    demo_user_id INTEGER;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@example.com';
    
    -- Insert sample tasks
    INSERT INTO tasks (user_id, title, description, category, priority, status, due_date, importance, progress, reorganizable, strict, notes) VALUES
    (demo_user_id, 'Complete project proposal', 'Write and submit the Q1 project proposal', 'Work', 'High', 'In Progress', CURRENT_TIMESTAMP + INTERVAL '5 days', 9, 60, true, false, 'Need to include budget analysis'),
    (demo_user_id, 'Buy groceries', 'Weekly grocery shopping', 'Personal', 'Medium', 'Todo', CURRENT_TIMESTAMP + INTERVAL '2 days', 5, 0, true, false, 'Don''t forget milk and bread'),
    (demo_user_id, 'Team meeting preparation', 'Prepare slides for Monday team meeting', 'Work', 'High', 'Todo', CURRENT_TIMESTAMP + INTERVAL '1 day', 8, 0, true, true, 'Focus on Q4 results'),
    (demo_user_id, 'Exercise routine', 'Daily 30-minute workout', 'Health', 'Medium', 'Completed', CURRENT_TIMESTAMP - INTERVAL '1 day', 7, 100, true, false, 'Completed morning run'),
    (demo_user_id, 'Read technical documentation', 'Review new API documentation', 'Learning', 'Low', 'Todo', CURRENT_TIMESTAMP + INTERVAL '10 days', 4, 0, true, false, 'New REST API features'),
    (demo_user_id, 'Doctor appointment', 'Annual health checkup', 'Health', 'Medium', 'Todo', CURRENT_TIMESTAMP + INTERVAL '7 days', 6, 0, false, true, 'Scheduled for 2 PM'),
    (demo_user_id, 'Update resume', 'Add recent projects to resume', 'Career', 'Low', 'Todo', CURRENT_TIMESTAMP + INTERVAL '14 days', 3, 0, true, false, 'Include MMTM project');
END $$;
