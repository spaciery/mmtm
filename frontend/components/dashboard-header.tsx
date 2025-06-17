"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Brain, Plus, MessageCircle, Menu, LogOut, Settings, User } from "lucide-react"
import type { Mood } from "@/types/mood"
import { useRouter } from "next/navigation"
import { ModeToggle } from "./mode-toggle"
import { removeAuthCookie } from "@/lib/auth"

interface DashboardHeaderProps {
  currentMood: Mood
  onOpenChat: () => void
  onCreateTask: () => void
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

const moodColors = {
  Happy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Tired: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Stressed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Focused: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Energetic: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
}

const moodEmojis = {
  Happy: "😊",
  Tired: "😴",
  Stressed: "😰",
  Focused: "🎯",
  Energetic: "⚡",
}

export default function DashboardHeader({
  currentMood,
  onOpenChat,
  onCreateTask,
  sidebarCollapsed,
  onToggleSidebar,
}: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Remove both cookie and localStorage
    removeAuthCookie()
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // Redirect to login
    router.push("/login")
    router.refresh()
  }

  const handleProfile = () => {
    router.push("/profile")
  }

  const handleSettings = () => {
    router.push("/settings")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="mr-4">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">MMTM</h1>
        </div>

        <div className="flex-1" />

        <div className="flex items-center space-x-4">
          <Badge className={moodColors[currentMood]} variant="secondary">
            <span className="mr-1">{moodEmojis[currentMood]}</span>
            {currentMood}
          </Badge>

          <Button variant="outline" size="sm" onClick={onOpenChat} className="hidden sm:flex">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </Button>

          <Button onClick={onCreateTask} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">User</p>
                  <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
