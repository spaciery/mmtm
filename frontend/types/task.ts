export type TaskStatus = "Todo" | "In Progress" | "Completed"
export type TaskPriority = "Low" | "Medium" | "High"

export interface Task {
  id: number
  title: string
  description: string
  category: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: Date
  importance: number // 1-10 scale
  progress: number // 0-100 percentage
  reorganizable: boolean
  strict: boolean // strict deadline that cannot be moved
  createdAt: Date
  updatedAt: Date
}
