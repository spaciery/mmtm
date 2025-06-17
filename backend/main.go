package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"mmtm/db"
	"mmtm/handlers"
	"mmtm/middleware"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize database
	database, err := db.InitDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.Close()

	// Initialize Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://your-frontend-domain.com"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(database)
	taskHandler := handlers.NewTaskHandler(database)
	userHandler := handlers.NewUserHandler(database)
	moodHandler := handlers.NewMoodHandler(database)

	// Public routes
	api := r.Group("/api")
	{
		api.POST("/auth/register", authHandler.Register)
		api.POST("/auth/login", authHandler.Login)
	}

	// Protected routes
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		// Task routes
		protected.GET("/tasks", taskHandler.GetTasks)
		protected.POST("/tasks", taskHandler.CreateTask)
		protected.GET("/tasks/:id", taskHandler.GetTask)
		protected.PUT("/tasks/:id", taskHandler.UpdateTask)
		protected.DELETE("/tasks/:id", taskHandler.DeleteTask)
		protected.POST("/tasks/reorganize", taskHandler.ReorganizeTasks)

		// User routes
		protected.GET("/user", userHandler.GetProfile)
		protected.PUT("/user", userHandler.UpdateProfile)

		// Mood routes
		protected.POST("/mood/analyze", moodHandler.AnalyzeMood)
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
