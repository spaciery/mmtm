package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"

	"mmtm/models"
)

type MoodHandler struct {
	db *sql.DB
}

func NewMoodHandler(db *sql.DB) *MoodHandler {
	return &MoodHandler{db: db}
}

func (h *MoodHandler) AnalyzeMood(c *gin.Context) {
	userID := c.GetInt("user_id")

	var req models.MoodAnalysisRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Try AI-powered mood analysis first
	mood, confidence, explanation, err := h.analyzeWithAI(req.Text)
	if err != nil {
		// Fallback to keyword-based analysis
		mood, confidence, explanation = h.analyzeWithKeywords(req.Text)
	}

	// Log the mood analysis
	_, err = h.db.Exec(`
		INSERT INTO mood_logs (user_id, mood, confidence, text_input)
		VALUES ($1, $2, $3, $4)`,
		userID, mood, confidence, req.Text)
	if err != nil {
		// Don't fail the request if logging fails
		fmt.Printf("Failed to log mood: %v\n", err)
	}

	response := models.MoodAnalysisResponse{
		Mood:        mood,
		Confidence:  confidence,
		Explanation: explanation,
	}

	c.JSON(http.StatusOK, response)
}

func (h *MoodHandler) analyzeWithAI(text string) (string, float64, string, error) {
	openaiKey := os.Getenv("OPENAI_API_KEY")
	if openaiKey == "" {
		return "", 0, "", fmt.Errorf("OpenAI API key not configured")
	}

	// Prepare the prompt for mood analysis
	prompt := fmt.Sprintf(`Analyze the mood of the following text and respond with a JSON object containing:
- mood: one of "Happy", "Tired", "Stressed", "Focused", "Energetic"
- confidence: a number between 0 and 1
- explanation: a brief explanation of why this mood was detected

Text to analyze: "%s"

Respond only with valid JSON.`, text)

	// Create the request payload
	payload := map[string]interface{}{
		"model": "gpt-3.5-turbo",
		"messages": []map[string]string{
			{
				"role":    "system",
				"content": "You are a mood analysis expert. Analyze text and determine the user's emotional state.",
			},
			{
				"role":    "user",
				"content": prompt,
			},
		},
		"max_tokens":  200,
		"temperature": 0.3,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return "", 0, "", err
	}

	// Make the API request
	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", strings.NewReader(string(payloadBytes)))
	if err != nil {
		return "", 0, "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+openaiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", 0, "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", 0, "", fmt.Errorf("OpenAI API returned status %d", resp.StatusCode)
	}

	// Parse the response
	var openaiResp struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&openaiResp); err != nil {
		return "", 0, "", err
	}

	if len(openaiResp.Choices) == 0 {
		return "", 0, "", fmt.Errorf("no response from OpenAI")
	}

	// Parse the mood analysis result
	var result struct {
		Mood        string  `json:"mood"`
		Confidence  float64 `json:"confidence"`
		Explanation string  `json:"explanation"`
	}

	content := strings.TrimSpace(openaiResp.Choices[0].Message.Content)
	if err := json.Unmarshal([]byte(content), &result); err != nil {
		return "", 0, "", err
	}

	// Validate the mood
	validMoods := map[string]bool{
		"Happy": true, "Tired": true, "Stressed": true, "Focused": true, "Energetic": true,
	}
	if !validMoods[result.Mood] {
		return "", 0, "", fmt.Errorf("invalid mood returned: %s", result.Mood)
	}

	return result.Mood, result.Confidence, result.Explanation, nil
}

func (h *MoodHandler) analyzeWithKeywords(text string) (string, float64, string) {
	lowerText := strings.ToLower(text)

	moodKeywords := map[string][]string{
		"Happy":     {"happy", "great", "awesome", "excited", "good", "wonderful", "fantastic", "cheerful", "joyful", "pleased", "delighted"},
		"Tired":     {"tired", "exhausted", "sleepy", "drained", "weary", "fatigue", "worn out", "beat", "drowsy", "lethargic"},
		"Stressed":  {"stressed", "overwhelmed", "anxious", "pressure", "worried", "tense", "frantic", "panic", "nervous", "uptight"},
		"Focused":   {"focused", "concentrated", "determined", "productive", "clear", "sharp", "alert", "attentive", "engaged"},
		"Energetic": {"energetic", "motivated", "pumped", "active", "dynamic", "vigorous", "enthusiastic", "lively", "spirited"},
	}

	moodScores := make(map[string]int)
	totalWords := 0

	// Count keyword matches for each mood
	for mood, keywords := range moodKeywords {
		for _, keyword := range keywords {
			if strings.Contains(lowerText, keyword) {
				moodScores[mood]++
				totalWords++
			}
		}
	}

	// Find the mood with the highest score
	var detectedMood string
	var maxScore int
	for mood, score := range moodScores {
		if score > maxScore {
			maxScore = score
			detectedMood = mood
		}
	}

	// Default to "Focused" if no keywords match
	if detectedMood == "" {
		detectedMood = "Focused"
		maxScore = 1
		totalWords = 1
	}

	// Calculate confidence based on keyword density
	confidence := float64(maxScore) / float64(len(strings.Fields(text)))
	if confidence > 1.0 {
		confidence = 1.0
	}
	if confidence < 0.1 {
		confidence = 0.1
	}

	explanations := map[string]string{
		"Happy":     "I detected positive and upbeat language in your message.",
		"Tired":     "Your message suggests you're feeling fatigued or low on energy.",
		"Stressed":  "I sense tension and pressure in your words.",
		"Focused":   "Your message indicates a clear and determined mindset.",
		"Energetic": "I can feel high energy and motivation in your message.",
	}

	explanation := explanations[detectedMood]
	if explanation == "" {
		explanation = "Based on the overall tone of your message."
	}

	return detectedMood, confidence, explanation
}
