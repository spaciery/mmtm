package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"mmtm/models"
)

type UserHandler struct {
	db *sql.DB
}

func NewUserHandler(db *sql.DB) *UserHandler {
	return &UserHandler{db: db}
}

func (h *UserHandler) GetProfile(c *gin.Context) {
	userID := c.GetInt("user_id")

	var user models.User
	err := h.db.QueryRow(`
		SELECT id, username, email, created_at, updated_at 
		FROM users WHERE id = $1`, userID).Scan(
		&user.ID, &user.Username, &user.Email, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, user)
}

type UpdateProfileRequest struct {
	Username *string `json:"username"`
	Email    *string `json:"email"`
	Password *string `json:"password"`
}

func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID := c.GetInt("user_id")
	
	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Build dynamic update query
	query := "UPDATE users SET updated_at = CURRENT_TIMESTAMP"
	args := []interface{}{}
	argIndex := 1

	if req.Username != nil {
		query += ", username = $" + string(rune(argIndex+'0'))
		args = append(args, *req.Username)
		argIndex++
	}
	if req.Email != nil {
		query += ", email = $" + string(rune(argIndex+'0'))
		args = append(args, *req.Email)
		argIndex++
	}
	if req.Password != nil {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(*req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}
		query += ", password_hash = $" + string(rune(argIndex+'0'))
		args = append(args, string(hashedPassword))
		argIndex++
	}

	query += " WHERE id = $" + string(rune(argIndex+'0'))
	args = append(args, userID)

	query += " RETURNING id, username, email, created_at, updated_at"

	var user models.User
	err := h.db.QueryRow(query, args...).Scan(
		&user.ID, &user.Username, &user.Email, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, user)
}
