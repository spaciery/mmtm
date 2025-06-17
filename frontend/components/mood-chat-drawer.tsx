"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Send, Bot, User, Loader2 } from "lucide-react"
import type { Mood } from "@/types/mood"
import { apiService } from "@/services/api"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface MoodChatDrawerProps {
  isOpen: boolean
  onClose: () => void
  onMoodDetected: (mood: Mood) => void
  currentMood: Mood
}

export default function MoodChatDrawer({ isOpen, onClose, onMoodDetected, currentMood }: MoodChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help understand how you're feeling today. Tell me about your current mood or how your day is going, and I'll help organize your tasks accordingly.",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSendMessage = async () => {
    if (!inputText.trim() || isAnalyzing) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsAnalyzing(true)

    try {
      // Call AI service to analyze mood
      const moodAnalysis = await apiService.analyzeMood(inputText)

      const botResponse: Message = {
        id: messages.length + 2,
        text: `I can sense you're feeling ${moodAnalysis.mood.toLowerCase()}. ${moodAnalysis.explanation} I've reorganized your tasks to match your current mood. This should help you be more productive!`,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
      onMoodDetected(moodAnalysis.mood)
    } catch (error) {
      // Fallback to keyword-based detection
      const detectedMood = detectMoodFromKeywords(inputText)

      const botResponse: Message = {
        id: messages.length + 2,
        text: `I can sense you're feeling ${detectedMood.toLowerCase()}. I've reorganized your tasks to match your current mood. This should help you be more productive!`,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
      onMoodDetected(detectedMood)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const detectMoodFromKeywords = (text: string): Mood => {
    const lowerText = text.toLowerCase()

    const moodKeywords = {
      Happy: ["happy", "great", "awesome", "excited", "good", "wonderful", "fantastic", "cheerful", "joyful"],
      Tired: ["tired", "exhausted", "sleepy", "drained", "weary", "fatigue", "worn out", "beat"],
      Stressed: ["stressed", "overwhelmed", "anxious", "pressure", "worried", "tense", "frantic", "panic"],
      Focused: ["focused", "concentrated", "determined", "productive", "clear", "sharp", "alert"],
      Energetic: ["energetic", "motivated", "pumped", "active", "dynamic", "vigorous", "enthusiastic"],
    }

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        return mood as Mood
      }
    }

    return "Focused" // Default mood
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>AI Mood Detection</SheetTitle>
          <SheetDescription>Tell me how you're feeling and I'll help organize your tasks accordingly.</SheetDescription>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Current mood:</span>
            <Badge variant="outline">{currentMood}</Badge>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-12rem)] mt-6">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                  {message.sender === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {isAnalyzing && (
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Analyzing your mood...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Input
              placeholder="How are you feeling today?"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isAnalyzing}
            />
            <Button onClick={handleSendMessage} size="icon" disabled={isAnalyzing || !inputText.trim()}>
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
