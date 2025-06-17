"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "./dashboard-header"
import DashboardSidebar from "./dashboard-sidebar"
import TaskList from "./task-list"
import TaskCalendar from "./task-calendar"
import TaskTimeline from "./task-timeline"
import TaskReports from "./task-reports"
import MoodChatDrawer from "./mood-chat-drawer"
import TaskForm from "./task-form"
import TaskEditDialog from "./task-edit-dialog"
import type { Task, TaskStatus } from "@/types/task"
import type { Mood } from "@/types/mood"
import { apiService } from "@/services/api"
import { getAuthToken } from "@/lib/auth"

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<"list" | "calendar" | "timeline" | "reports">("list")
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentMood, setCurrentMood] = useState<Mood>("Focused")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check authentication and load tasks
  useEffect(() => {
    const token = getAuthToken() || localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    loadTasks()
  }, [router])

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const tasksData = await apiService.getTasks()
      // Ensure tasks is always an array
      setTasks(Array.isArray(tasksData) ? tasksData : [])
    } catch (error) {
      console.error("Failed to load tasks:", error)
      setError("Failed to load tasks")
      setTasks([]) // Set empty array on error

      // If unauthorized, redirect to login
      if (error instanceof Error && error.message.includes("401")) {
        router.push("/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleMoodChange = async (mood: Mood) => {
    setCurrentMood(mood)
    try {
      const reorganizedTasks = await apiService.reorganizeTasks(mood)
      setTasks(Array.isArray(reorganizedTasks) ? reorganizedTasks : [])
    } catch (error) {
      console.error("Failed to reorganize tasks:", error)
      // Fallback to client-side reorganization
      reorganizeTasksLocally(mood)
    }
  }

  const reorganizeTasksLocally = (mood: Mood) => {
    setTasks((prevTasks) => {
      if (!Array.isArray(prevTasks)) return []

      const reorganizableTasks = prevTasks.filter((task) => task.reorganizable && task.status !== "Completed")
      const fixedTasks = prevTasks.filter((task) => !task.reorganizable || task.status === "Completed")

      const sortedReorganizable = [...reorganizableTasks]

      switch (mood) {
        case "Tired":
          sortedReorganizable.sort((a, b) => {
            const priorityOrder = { Low: 1, Medium: 2, High: 3 }
            return priorityOrder[a.priority] - priorityOrder[b.priority]
          })
          break
        case "Energetic":
          sortedReorganizable.sort((a, b) => {
            const priorityOrder = { Low: 1, Medium: 2, High: 3 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          })
          break
        case "Focused":
          sortedReorganizable.sort((a, b) => b.importance - a.importance)
          break
        case "Stressed":
          sortedReorganizable.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          break
        case "Happy":
          sortedReorganizable.sort((a, b) => {
            const aScore = a.importance + (a.priority === "High" ? 3 : a.priority === "Medium" ? 2 : 1)
            const bScore = b.importance + (b.priority === "High" ? 3 : b.priority === "Medium" ? 2 : 1)
            return bScore - aScore
          })
          break
      }

      return [...sortedReorganizable, ...fixedTasks].sort((a, b) => a.id - b.id)
    })
  }

  const handleCreateTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newTask = await apiService.createTask(taskData)
      setTasks((prev) => [...(Array.isArray(prev) ? prev : []), newTask])
      setIsTaskFormOpen(false)
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const updated = await apiService.updateTask(updatedTask.id, updatedTask)
      setTasks((prev) =>
        Array.isArray(prev) ? prev.map((task) => (task.id === updated.id ? updated : task)) : [updated],
      )
      setEditingTask(null)
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    try {
      await apiService.deleteTask(taskId)
      setTasks((prev) => (Array.isArray(prev) ? prev.filter((task) => task.id !== taskId) : []))
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    try {
      const task = tasks.find((t) => t.id === taskId)
      if (task) {
        const updatedTask = { ...task, status }
        await apiService.updateTask(taskId, updatedTask)
        setTasks((prev) => (Array.isArray(prev) ? prev.map((t) => (t.id === taskId ? updatedTask : t)) : []))
      }
    } catch (error) {
      console.error("Failed to update task status:", error)
    }
  }

  const renderCurrentView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-red-500">{error}</p>
          <button onClick={loadTasks} className="px-4 py-2 bg-primary text-primary-foreground rounded">
            Retry
          </button>
        </div>
      )
    }

    switch (currentView) {
      case "list":
        return (
          <TaskList
            tasks={tasks}
            onEditTask={setEditingTask}
            onDeleteTask={handleDeleteTask}
            onStatusChange={handleStatusChange}
            currentMood={currentMood}
          />
        )
      case "calendar":
        return <TaskCalendar tasks={tasks} onEditTask={setEditingTask} />
      case "timeline":
        return <TaskTimeline tasks={tasks} onEditTask={setEditingTask} />
      case "reports":
        return <TaskReports tasks={tasks} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        currentMood={currentMood}
        onOpenChat={() => setIsChatOpen(true)}
        onCreateTask={() => setIsTaskFormOpen(true)}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex">
        <DashboardSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          tasks={tasks}
          collapsed={sidebarCollapsed}
        />

        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <div className="p-6">{renderCurrentView()}</div>
        </main>
      </div>

      <MoodChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onMoodDetected={handleMoodChange}
        currentMood={currentMood}
      />

      <TaskForm isOpen={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)} onSubmit={handleCreateTask} />

      {editingTask && (
        <TaskEditDialog
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleUpdateTask}
        />
      )}
    </div>
  )
}
