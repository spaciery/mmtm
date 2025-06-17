import type { Task } from "@/types/task"
import type { Mood } from "@/types/mood"
import { getAuthToken } from "@/lib/auth"

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
  }
}

export interface MoodAnalysis {
  mood: Mood
  confidence: number
  explanation: string
}

class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Get token from cookie or localStorage
    const token = getAuthToken() || localStorage.getItem("token")

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>("/tasks")
  }

  async createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
    return this.request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    })
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(task),
    })
  }

  async deleteTask(id: number): Promise<void> {
    return this.request<void>(`/tasks/${id}`, {
      method: "DELETE",
    })
  }

  async analyzeMood(text: string): Promise<MoodAnalysis> {
    return this.request<MoodAnalysis>("/mood/analyze", {
      method: "POST",
      body: JSON.stringify({ text }),
    })
  }

  async reorganizeTasks(mood: Mood): Promise<Task[]> {
    return this.request<Task[]>("/tasks/reorganize", {
      method: "POST",
      body: JSON.stringify({ mood }),
    })
  }

  async getUserProfile() {
    return this.request("/user")
  }

  async updateUserProfile(data: any) {
    return this.request("/user", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }
}

export const apiService = new ApiService()
