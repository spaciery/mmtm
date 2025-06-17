"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Circle,
  Search,
  Calendar,
  Flag,
  Brain,
  FileText,
  Plus,
} from "lucide-react"
import type { Task, TaskStatus, TaskPriority } from "@/types/task"
import type { Mood } from "@/types/mood"
import { format } from "date-fns"

interface TaskListProps {
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: number) => void
  onStatusChange: (taskId: number, status: TaskStatus) => void
  currentMood: Mood
}

const priorityColors = {
  Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

const statusIcons = {
  Todo: Circle,
  "In Progress": Clock,
  Completed: CheckCircle,
}

export default function TaskList({ tasks, onEditTask, onDeleteTask, onStatusChange, currentMood }: TaskListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "All">("All")
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "All">("All")
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "importance" | "title">("dueDate")
  const [selectedTaskNotes, setSelectedTaskNotes] = useState<Task | null>(null)

  // Ensure tasks is always an array
  const safeTasks = Array.isArray(tasks) ? tasks : []

  const filteredAndSortedTasks = safeTasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "All" || task.status === filterStatus
      const matchesPriority = filterPriority === "All" || task.priority === filterPriority
      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case "priority":
          const priorityOrder = { High: 3, Medium: 2, Low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "importance":
          return b.importance - a.importance
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const getStatusIcon = (status: TaskStatus) => {
    const Icon = statusIcons[status]
    return <Icon className="h-4 w-4" />
  }

  const isOverdue = (task: Task) => {
    return task.status !== "Completed" && new Date(task.dueDate) < new Date()
  }

  const getMoodRecommendation = (task: Task) => {
    switch (currentMood) {
      case "Tired":
        return task.priority === "Low" ? "Recommended for your current mood" : null
      case "Energetic":
        return task.priority === "High" ? "Perfect for your energy level" : null
      case "Focused":
        return task.importance >= 7 ? "Great for focused work" : null
      case "Stressed":
        return isOverdue(task) ? "Priority due to deadline" : null
      case "Happy":
        return "Good balance for your positive mood"
      default:
        return null
    }
  }

  if (safeTasks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground text-center">
              <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
              <p className="text-sm">Create your first task to get started with mood-based task management</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as TaskStatus | "All")}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Todo">Todo</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as TaskPriority | "All")}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Priority</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="importance">Importance</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredAndSortedTasks.map((task) => {
          const recommendation = getMoodRecommendation(task)

          return (
            <Card
              key={task.id}
              className={`transition-all hover:shadow-md ${isOverdue(task) ? "border-red-200 dark:border-red-800" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newStatus =
                            task.status === "Completed" ? "Todo" : task.status === "Todo" ? "In Progress" : "Completed"
                          onStatusChange(task.id, newStatus)
                        }}
                        className="p-0 h-auto"
                      >
                        {getStatusIcon(task.status)}
                      </Button>
                      <CardTitle
                        className={`text-lg ${task.status === "Completed" ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </CardTitle>
                      {task.reorganizable && (
                        <Brain className="h-4 w-4 text-primary" title="Reorganizable based on mood" />
                      )}
                    </div>

                    {recommendation && (
                      <Badge variant="outline" className="mb-2 text-xs">
                        💡 {recommendation}
                      </Badge>
                    )}

                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge className={priorityColors[task.priority]} variant="secondary">
                        <Flag className="h-3 w-3 mr-1" />
                        {task.priority}
                      </Badge>
                      <Badge variant="outline">{task.category}</Badge>
                      <Badge variant="outline" className={isOverdue(task) ? "border-red-500 text-red-500" : ""}>
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(task.dueDate), "MMM dd, yyyy")}
                      </Badge>
                      <Badge variant="outline">Importance: {task.importance}/10</Badge>
                      {task.notes && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <FileText className="h-3 w-3 mr-1" />
                              Notes
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Task Notes: {task.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Textarea
                                value={task.notes}
                                readOnly
                                className="min-h-[200px]"
                                placeholder="No notes available"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>

                    {task.progress > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditTask(task)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedTaskNotes(task)}>
                        <FileText className="h-4 w-4 mr-2" />
                        View Notes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
            </Card>
          )
        })}

        {filteredAndSortedTasks.length === 0 && safeTasks.length > 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground text-center">
                <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Notes Dialog */}
      {selectedTaskNotes && (
        <Dialog open={!!selectedTaskNotes} onOpenChange={() => setSelectedTaskNotes(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Notes: {selectedTaskNotes.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea value={selectedTaskNotes.notes || "No notes available"} readOnly className="min-h-[300px]" />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
