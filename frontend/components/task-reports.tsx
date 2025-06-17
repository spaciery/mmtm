"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, CheckCircle, Clock, AlertTriangle, Target, Calendar, Flag } from "lucide-react"
import type { Task } from "@/types/task"
import { isAfter, isBefore, startOfWeek, endOfWeek } from "date-fns"

interface TaskReportsProps {
  tasks: Task[]
}

export default function TaskReports({ tasks }: TaskReportsProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "Completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length
  const todoTasks = tasks.filter((task) => task.status === "Todo").length

  const today = new Date()
  const weekStart = startOfWeek(today)
  const weekEnd = endOfWeek(today)

  const overdueTasks = tasks.filter(
    (task) => task.status !== "Completed" && isBefore(new Date(task.dueDate), today),
  ).length

  const thisWeekTasks = tasks.filter(
    (task) => isAfter(new Date(task.dueDate), weekStart) && isBefore(new Date(task.dueDate), weekEnd),
  ).length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Priority distribution
  const highPriorityTasks = tasks.filter((task) => task.priority === "High").length
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "Medium").length
  const lowPriorityTasks = tasks.filter((task) => task.priority === "Low").length

  // Category distribution
  const categories = [...new Set(tasks.map((task) => task.category))]
  const categoryStats = categories.map((category) => ({
    name: category,
    count: tasks.filter((task) => task.category === category).length,
    completed: tasks.filter((task) => task.category === category && task.status === "Completed").length,
  }))

  // Average importance
  const avgImportance =
    totalTasks > 0 ? Math.round(tasks.reduce((sum, task) => sum + task.importance, 0) / totalTasks) : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">All tasks in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeekTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks past due date</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Task Status Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{completedTasks}</span>
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">In Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{inProgressTasks}</span>
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full border-2 border-gray-400" />
                  <span className="text-sm">Todo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{todoTasks}</span>
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-gray-400 h-2 rounded-full"
                      style={{ width: `${totalTasks > 0 ? (todoTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flag className="h-5 w-5" />
              <span>Priority Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-red-500 rounded" />
                  <span className="text-sm">High Priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{highPriorityTasks}</span>
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${totalTasks > 0 ? (highPriorityTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-yellow-500 rounded" />
                  <span className="text-sm">Medium Priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{mediumPriorityTasks}</span>
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${totalTasks > 0 ? (mediumPriorityTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-green-500 rounded" />
                  <span className="text-sm">Low Priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{lowPriorityTasks}</span>
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${totalTasks > 0 ? (lowPriorityTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Category Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryStats.map((category) => {
              const completionRate = category.count > 0 ? Math.round((category.completed / category.count) * 100) : 0
              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{category.name}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {category.completed}/{category.count} completed
                      </span>
                    </div>
                    <span className="text-sm font-medium">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Average Importance</span>
              <Badge variant="outline">{avgImportance}/10</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Reorganizable Tasks</span>
              <Badge variant="outline">{tasks.filter((task) => task.reorganizable).length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Strict Deadlines</span>
              <Badge variant="outline">{tasks.filter((task) => task.strict).length}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productivity Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              {completionRate >= 80 && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Excellent completion rate!</span>
                </div>
              )}
              {completionRate >= 60 && completionRate < 80 && (
                <div className="flex items-center space-x-2 text-yellow-600">
                  <Clock className="h-4 w-4" />
                  <span>Good progress, keep it up!</span>
                </div>
              )}
              {completionRate < 60 && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Consider reviewing your task priorities</span>
                </div>
              )}
            </div>

            {overdueTasks > 0 && (
              <div className="text-sm text-red-600">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>
                    You have {overdueTasks} overdue task{overdueTasks > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            )}

            {highPriorityTasks > 0 && (
              <div className="text-sm text-blue-600">
                <div className="flex items-center space-x-2">
                  <Flag className="h-4 w-4" />
                  <span>
                    Focus on {highPriorityTasks} high-priority task{highPriorityTasks > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
