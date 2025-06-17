package handlers

import (
	"database/sql"
	"net/http"
	"sort"
	"strconv"

	"github.com/gin-gonic/gin"

	"mmtm/models"
)

type TaskHandler struct {
	db *sql.DB
}

func NewTaskHandler(db *sql.DB) *TaskHandler {
	return &TaskHandler{db: db}
}

func (h *TaskHandler) GetTasks(c *gin.Context) {
	userID := c.GetInt("user_id")

	rows, err := h.db.Query(`
		SELECT id, user_id, title, description, category, priority, status, 
		       due_date, importance, progress, reorganizable, strict, notes,
		       created_at, updated_at
		FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
		return
	}
	defer rows.Close()

	var tasks []models.Task
	for rows.Next() {
		var task models.Task
		err := rows.Scan(&task.ID, &task.UserID, &task.Title, &task.Description,
			&task.Category, &task.Priority, &task.Status, &task.DueDate,
			&task.Importance, &task.Progress, &task.Reorganizable, &task.Strict,
			&task.Notes, &task.CreatedAt, &task.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan task"})
			return
		}
		tasks = append(tasks, task)
	}

	c.JSON(http.StatusOK, tasks)
}

func (h *TaskHandler) CreateTask(c *gin.Context) {
	userID := c.GetInt("user_id")

	var req models.CreateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var task models.Task
	err := h.db.QueryRow(`
		INSERT INTO tasks (user_id, title, description, category, priority, status,
		                  due_date, importance, progress, reorganizable, strict, notes)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id, user_id, title, description, category, priority, status,
		          due_date, importance, progress, reorganizable, strict, notes,
		          created_at, updated_at`,
		userID, req.Title, req.Description, req.Category, req.Priority, req.Status,
		req.DueDate, req.Importance, req.Progress, req.Reorganizable, req.Strict, req.Notes).Scan(
		&task.ID, &task.UserID, &task.Title, &task.Description, &task.Category,
		&task.Priority, &task.Status, &task.DueDate, &task.Importance, &task.Progress,
		&task.Reorganizable, &task.Strict, &task.Notes, &task.CreatedAt, &task.UpdatedAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}

	c.JSON(http.StatusCreated, task)
}

func (h *TaskHandler) GetTask(c *gin.Context) {
	userID := c.GetInt("user_id")
	taskID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var task models.Task
	err = h.db.QueryRow(`
		SELECT id, user_id, title, description, category, priority, status,
		       due_date, importance, progress, reorganizable, strict, notes,
		       created_at, updated_at
		FROM tasks WHERE id = $1 AND user_id = $2`, taskID, userID).Scan(
		&task.ID, &task.UserID, &task.Title, &task.Description, &task.Category,
		&task.Priority, &task.Status, &task.DueDate, &task.Importance, &task.Progress,
		&task.Reorganizable, &task.Strict, &task.Notes, &task.CreatedAt, &task.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch task"})
		return
	}

	c.JSON(http.StatusOK, task)
}

func (h *TaskHandler) UpdateTask(c *gin.Context) {
	userID := c.GetInt("user_id")
	taskID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var req models.UpdateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Build dynamic update query
	query := "UPDATE tasks SET updated_at = CURRENT_TIMESTAMP"
	args := []interface{}{}
	argIndex := 1

	if req.Title != nil {
		query += ", title = $" + strconv.Itoa(argIndex)
		args = append(args, *req.Title)
		argIndex++
	}
	if req.Description != nil {
		query += ", description = $" + strconv.Itoa(argIndex)
		args = append(args, *req.Description)
		argIndex++
	}
	if req.Category != nil {
		query += ", category = $" + strconv.Itoa(argIndex)
		args = append(args, *req.Category)
		argIndex++
	}
	if req.Priority != nil {
		query += ", priority = $" + strconv.Itoa(argIndex)
		args = append(args, *req.Priority)
		argIndex++
	}
	if req.Status != nil {
		query += ", status = $" + strconv.Itoa(argIndex)
		args = append(args, *req.Status)
		argIndex++
	}
	if req.DueDate != nil {
		query += ", due_date = $" + strconv.Itoa(argIndex)
		args = append(args, *req.DueDate)
		argIndex++
	}
	if req.Importance != nil {
		query += ", importance = $" + strconv.Itoa(argIndex)
		args = append(args, *req.Importance)
		argIndex++
	}
	if req.Progress != nil {
		query += ", progress = $" + strconv.Itoa(argIndex)
		args = append(args, *req.Progress)
		argIndex++
	}
	if req.Reorganizable != nil {
		query += ", reorganizable = $" + strconv.Itoa(argIndex)
		args = append(args, *req.Reorganizable)
		argIndex++
	}
	if req.Strict != nil {
		query += ", strict = $" + strconv.Itoa(argIndex)
		args = append(args, *req.Strict)
		argIndex++
	}
	if req.Notes != nil {
		query += ", notes = $" + strconv.Itoa(argIndex)
		args = append(args, *req.Notes)
		argIndex++
	}

	query += " WHERE id = $" + strconv.Itoa(argIndex) + " AND user_id = $" + strconv.Itoa(argIndex+1)
	args = append(args, taskID, userID)

	query += ` RETURNING id, user_id, title, description, category, priority, status,
	           due_date, importance, progress, reorganizable, strict, notes,
	           created_at, updated_at`

	var task models.Task
	err = h.db.QueryRow(query, args...).Scan(
		&task.ID, &task.UserID, &task.Title, &task.Description, &task.Category,
		&task.Priority, &task.Status, &task.DueDate, &task.Importance, &task.Progress,
		&task.Reorganizable, &task.Strict, &task.Notes, &task.CreatedAt, &task.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task"})
		return
	}

	c.JSON(http.StatusOK, task)
}

func (h *TaskHandler) DeleteTask(c *gin.Context) {
	userID := c.GetInt("user_id")
	taskID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	result, err := h.db.Exec("DELETE FROM tasks WHERE id = $1 AND user_id = $2", taskID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check deletion"})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

func (h *TaskHandler) ReorganizeTasks(c *gin.Context) {
	userID := c.GetInt("user_id")

	var req models.ReorganizeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get all reorganizable tasks for the user
	rows, err := h.db.Query(`
		SELECT id, user_id, title, description, category, priority, status,
		       due_date, importance, progress, reorganizable, strict, notes,
		       created_at, updated_at
		FROM tasks 
		WHERE user_id = $1 AND reorganizable = true AND status != 'Completed'
		ORDER BY created_at`, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
		return
	}
	defer rows.Close()

	var tasks []models.Task
	for rows.Next() {
		var task models.Task
		err := rows.Scan(&task.ID, &task.UserID, &task.Title, &task.Description,
			&task.Category, &task.Priority, &task.Status, &task.DueDate,
			&task.Importance, &task.Progress, &task.Reorganizable, &task.Strict,
			&task.Notes, &task.CreatedAt, &task.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan task"})
			return
		}
		tasks = append(tasks, task)
	}

	// Reorganize tasks based on mood
	reorganizeTasks(tasks, req.Mood)

	// Get all tasks (including non-reorganizable ones) to return
	allRows, err := h.db.Query(`
		SELECT id, user_id, title, description, category, priority, status,
		       due_date, importance, progress, reorganizable, strict, notes,
		       created_at, updated_at
		FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch all tasks"})
		return
	}
	defer allRows.Close()

	var allTasks []models.Task
	for allRows.Next() {
		var task models.Task
		err := allRows.Scan(&task.ID, &task.UserID, &task.Title, &task.Description,
			&task.Category, &task.Priority, &task.Status, &task.DueDate,
			&task.Importance, &task.Progress, &task.Reorganizable, &task.Strict,
			&task.Notes, &task.CreatedAt, &task.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan task"})
			return
		}
		allTasks = append(allTasks, task)
	}

	c.JSON(http.StatusOK, allTasks)
}

func reorganizeTasks(tasks []models.Task, mood string) {
	switch mood {
	case "Tired":
		// Prioritize easier (low priority) tasks first
		sort.Slice(tasks, func(i, j int) bool {
			priorityOrder := map[string]int{"Low": 1, "Medium": 2, "High": 3}
			return priorityOrder[tasks[i].Priority] < priorityOrder[tasks[j].Priority]
		})
	case "Energetic":
		// Prioritize harder (high priority) tasks first
		sort.Slice(tasks, func(i, j int) bool {
			priorityOrder := map[string]int{"Low": 1, "Medium": 2, "High": 3}
			return priorityOrder[tasks[i].Priority] > priorityOrder[tasks[j].Priority]
		})
	case "Focused":
		// Prioritize important tasks
		sort.Slice(tasks, func(i, j int) bool {
			return tasks[i].Importance > tasks[j].Importance
		})
	case "Stressed":
		// Prioritize tasks with approaching deadlines
		sort.Slice(tasks, func(i, j int) bool {
			return tasks[i].DueDate.Before(tasks[j].DueDate)
		})
	case "Happy":
		// Balance task difficulty and importance
		sort.Slice(tasks, func(i, j int) bool {
			priorityScore := map[string]int{"Low": 1, "Medium": 2, "High": 3}
			scoreI := tasks[i].Importance + priorityScore[tasks[i].Priority]
			scoreJ := tasks[j].Importance + priorityScore[tasks[j].Priority]
			return scoreI > scoreJ
		})
	}
}
