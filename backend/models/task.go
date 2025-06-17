package models

import "time"

type Task struct {
	ID            int       `json:"id" db:"id"`
	UserID        int       `json:"user_id" db:"user_id"`
	Title         string    `json:"title" db:"title"`
	Description   string    `json:"description" db:"description"`
	Category      string    `json:"category" db:"category"`
	Priority      string    `json:"priority" db:"priority"`
	Status        string    `json:"status" db:"status"`
	DueDate       time.Time `json:"dueDate" db:"due_date"`
	Importance    int       `json:"importance" db:"importance"`
	Progress      int       `json:"progress" db:"progress"`
	Reorganizable bool      `json:"reorganizable" db:"reorganizable"`
	Strict        bool      `json:"strict" db:"strict"`
	Notes         string    `json:"notes" db:"notes"`
	CreatedAt     time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt     time.Time `json:"updatedAt" db:"updated_at"`
}

type CreateTaskRequest struct {
	Title         string    `json:"title" binding:"required"`
	Description   string    `json:"description"`
	Category      string    `json:"category" binding:"required"`
	Priority      string    `json:"priority" binding:"required,oneof=Low Medium High"`
	Status        string    `json:"status" binding:"required,oneof=Todo 'In Progress' Completed"`
	DueDate       time.Time `json:"dueDate" binding:"required"`
	Importance    int       `json:"importance" binding:"required,min=1,max=10"`
	Progress      int       `json:"progress" binding:"min=0,max=100"`
	Reorganizable bool      `json:"reorganizable"`
	Strict        bool      `json:"strict"`
	Notes         string    `json:"notes"`
}

type UpdateTaskRequest struct {
	Title         *string    `json:"title"`
	Description   *string    `json:"description"`
	Category      *string    `json:"category"`
	Priority      *string    `json:"priority"`
	Status        *string    `json:"status"`
	DueDate       *time.Time `json:"dueDate"`
	Importance    *int       `json:"importance"`
	Progress      *int       `json:"progress"`
	Reorganizable *bool      `json:"reorganizable"`
	Strict        *bool      `json:"strict"`
	Notes         *string    `json:"notes"`
}

type ReorganizeRequest struct {
	Mood string `json:"mood" binding:"required,oneof=Happy Tired Stressed Focused Energetic"`
}
