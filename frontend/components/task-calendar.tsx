"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import type { Task } from "@/types/task"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns"

interface TaskCalendarProps {
  tasks: Task[]
  onEditTask: (task: Task) => void
}

const priorityColors = {
  Low: "bg-green-500",
  Medium: "bg-yellow-500",
  High: "bg-red-500",
}

export default function TaskCalendar({ tasks, onEditTask }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => isSameDay(new Date(task.dueDate), date))
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => (direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1)))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Task Calendar</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold min-w-[200px] text-center">{format(currentDate, "MMMM yyyy")}</h2>
              <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((day) => {
              const dayTasks = getTasksForDate(day)
              const isToday = isSameDay(day, new Date())
              const isCurrentMonth = isSameMonth(day, currentDate)

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[100px] p-2 border rounded-lg ${
                    isCurrentMonth ? "bg-background" : "bg-muted/50"
                  } ${isToday ? "ring-2 ring-primary" : ""}`}
                >
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {format(day, "d")}
                  </div>

                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: `${priorityColors[task.priority]}20` }}
                        onClick={() => onEditTask(task)}
                      >
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
                          <span className="truncate flex-1">{task.title}</span>
                        </div>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">+{dayTasks.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm">High Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm">Medium Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Low Priority</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
