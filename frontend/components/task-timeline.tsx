"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TimerIcon as Timeline, Edit, Calendar, Flag } from "lucide-react"
import type { Task } from "@/types/task"
import { format, isAfter, isBefore, addDays } from "date-fns"

interface TaskTimelineProps {
  tasks: Task[]
  onEditTask: (task: Task) => void
}

const priorityColors = {
  Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

const statusColors = {
  Todo: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

export default function TaskTimeline({ tasks, onEditTask }: TaskTimelineProps) {
  const today = new Date()
  const nextWeek = addDays(today, 7)

  // Group tasks by time periods
  const overdueTasks = tasks.filter((task) => task.status !== "Completed" && isBefore(new Date(task.dueDate), today))

  const todayTasks = tasks.filter(
    (task) => format(new Date(task.dueDate), "yyyy-MM-dd") === format(today, "yyyy-MM-dd"),
  )

  const thisWeekTasks = tasks.filter(
    (task) => isAfter(new Date(task.dueDate), today) && isBefore(new Date(task.dueDate), nextWeek),
  )

  const futureTasks = tasks.filter((task) => isAfter(new Date(task.dueDate), nextWeek))

  const TimelineSection = ({
    title,
    tasks,
    color = "text-foreground",
  }: {
    title: string
    tasks: Task[]
    color?: string
  }) => (
    <div className="relative">
      <div className="flex items-center space-x-2 mb-4">
        <div
          className={`w-4 h-4 rounded-full ${color === "text-red-600" ? "bg-red-500" : color === "text-blue-600" ? "bg-blue-500" : color === "text-green-600" ? "bg-green-500" : "bg-gray-500"}`}
        />
        <h3 className={`text-lg font-semibold ${color}`}>{title}</h3>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>

      <div className="ml-6 space-y-4 border-l-2 border-muted pl-6">
        {tasks.length === 0 ? (
          <p className="text-muted-foreground text-sm">No tasks in this period</p>
        ) : (
          tasks.map((task, index) => (
            <Card key={task.id} className="relative">
              <div className="absolute -left-9 top-4 w-3 h-3 bg-background border-2 border-muted-foreground rounded-full" />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle
                        className={`text-base ${task.status === "Completed" ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </CardTitle>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge className={statusColors[task.status]} variant="secondary">
                        {task.status}
                      </Badge>
                      <Badge className={priorityColors[task.priority]} variant="secondary">
                        <Flag className="h-3 w-3 mr-1" />
                        {task.priority}
                      </Badge>
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(task.dueDate), "MMM dd, yyyy")}
                      </Badge>
                      <Badge variant="outline">{task.category}</Badge>
                    </div>

                    {task.progress > 0 && (
                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    )}
                  </div>

                  <Button variant="ghost" size="icon" onClick={() => onEditTask(task)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Timeline className="h-5 w-5" />
            <span>Task Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <TimelineSection title="Overdue" tasks={overdueTasks} color="text-red-600" />

            <TimelineSection title="Today" tasks={todayTasks} color="text-blue-600" />

            <TimelineSection title="This Week" tasks={thisWeekTasks} color="text-green-600" />

            <TimelineSection title="Future" tasks={futureTasks} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
