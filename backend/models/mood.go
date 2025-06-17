package models

import "time"

type MoodLog struct {
	ID         int       `json:"id" db:"id"`
	UserID     int       `json:"user_id" db:"user_id"`
	Mood       string    `json:"mood" db:"mood"`
	Confidence float64   `json:"confidence" db:"confidence"`
	TextInput  string    `json:"text_input" db:"text_input"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

type MoodAnalysisRequest struct {
	Text string `json:"text" binding:"required"`
}

type MoodAnalysisResponse struct {
	Mood        string  `json:"mood"`
	Confidence  float64 `json:"confidence"`
	Explanation string  `json:"explanation"`
}
