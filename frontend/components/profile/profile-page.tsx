"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, Calendar, Activity, Trophy, Target } from "lucide-react"
import { getAuthToken } from "@/lib/auth"
import { apiService } from "@/services/api"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  })
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    currentStreak: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const token = getAuthToken() || localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    loadProfile()
    loadStats()
  }, [router])

  const loadProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      setUser(userData)
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
      })
    } catch (error) {
      console.error("Failed to load profile:", error)
    }
  }

  const loadStats = async () => {
    try {
      const tasks = await apiService.getTasks()
      const totalTasks = tasks.length
      const completedTasks = tasks.filter((task: any) => task.status === "Completed").length
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      setStats({
        totalTasks,
        completedTasks,
        completionRate,
        currentStreak: 5, // Mock data - you could calculate this based on completion dates
      })
    } catch (error) {
      console.error("Failed to load stats:", error)
    }
  }

  const handleSave = async () => {
    try {
      await apiService.updateUserProfile(formData)

      // Update localStorage
      const updatedUser = { ...user, ...formData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
    })
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account information</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Info */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-user.jpg" alt={user.username} />
                    <AvatarFallback className="text-lg">
                      {user.username?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{user.username}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Avatar
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Member Since</Label>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(user.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>Save Changes</Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalTasks}</div>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                </div>

                <Separator />

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>

                <Separator />

                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.completionRate}%</div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>

                <Separator />

                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="secondary" className="w-full justify-center">
                  <Target className="h-3 w-3 mr-1" />
                  First Task Completed
                </Badge>
                <Badge variant="secondary" className="w-full justify-center">
                  <Activity className="h-3 w-3 mr-1" />5 Day Streak
                </Badge>
                <Badge variant="outline" className="w-full justify-center opacity-50">
                  <Trophy className="h-3 w-3 mr-1" />
                  Task Master (10 completed)
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
