"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { List, Calendar, TimerIcon as Timeline, BarChart3, CheckCircle, Clock, AlertCircle, Circle } from "lucide-react"
import type { Task } from "@/types/task"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  currentView: "list" | "calendar" | "timeline" | "reports"
  onViewChange: (view: "list" | "calendar" | "timeline" | "reports") => void
  tasks: Task[]
  collapsed: boolean
}

export default function DashboardSidebar({ currentView, onViewChange, tasks, collapsed }: DashboardSidebarProps) {
  const completedTasks = tasks.filter((task) => task.status === "Completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length
  const todoTasks = tasks.filter((task) => task.status === "Todo").length
  const overdueTasks = tasks.filter((task) => task.status !== "Completed" && new Date(task.dueDate) < new Date()).length

  const views = [
    { id: "list" as const, label: "Task List", icon: List },
    { id: "calendar" as const, label: "Calendar", icon: Calendar },
    { id: "timeline" as const, label: "Timeline", icon: Timeline },
    { id: "reports" as const, label: "Reports", icon: BarChart3 },
  ]

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 p-4 space-y-2">
          {views.map((view) => {
            const Icon = view.icon
            return (
              <Button
                key={view.id}
                variant={currentView === view.id ? "default" : "ghost"}
                className={cn("w-full justify-start", collapsed && "px-2")}
                onClick={() => onViewChange(view.id)}
              >
                <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                {!collapsed && view.label}
              </Button>
            )
          })}
        </nav>

        {!collapsed && (
          <div className="p-4 border-t">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Task Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <Badge variant="secondary">{completedTasks}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">In Progress</span>
                  </div>
                  <Badge variant="secondary">{inProgressTasks}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Circle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Todo</span>
                  </div>
                  <Badge variant="secondary">{todoTasks}</Badge>
                </div>
                {overdueTasks > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Overdue</span>
                    </div>
                    <Badge variant="destructive">{overdueTasks}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </aside>
  )
}
