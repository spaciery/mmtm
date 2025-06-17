"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Task, TaskPriority, TaskStatus } from "@/types/task"
import { format } from "date-fns"

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
}

export default function TaskForm({ isOpen, onClose, onSubmit }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium" as TaskPriority,
    status: "Todo" as TaskStatus,
    dueDate: format(new Date(), "yyyy-MM-dd"),
    importance: [5],
    progress: 0,
    reorganizable: true,
    strict: false,
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const taskData = {
      ...formData,
      dueDate: new Date(formData.dueDate),
      importance: formData.importance[0],
    }

    onSubmit(taskData)

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "Medium",
      status: "Todo",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      importance: [5],
      progress: 0,
      reorganizable: true,
      strict: false,
      notes: "",
    })
  }

  const handleClose = () => {
    onClose()
    // Reset form when closing
    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "Medium",
      status: "Todo",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      importance: [5],
      progress: 0,
      reorganizable: true,
      strict: false,
      notes: "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to your list. Fill in the details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Enter task category"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value as TaskPriority }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as TaskStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todo">Todo</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="importance">Importance</Label>
                <Slider
                  defaultValue={[5]}
                  max={10}
                  min={1}
                  step={1}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, importance: value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="progress">Progress</Label>
                <Slider
                  defaultValue={[0]}
                  max={100}
                  min={0}
                  step={1}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, progress: value[0] }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reorganizable">Reorganizable</Label>
                <Switch
                  id="reorganizable"
                  checked={formData.reorganizable}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, reorganizable: checked }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="strict">Strict</Label>
                <Switch
                  id="strict"
                  checked={formData.strict}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, strict: checked }))}
                />
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Enter any additional notes"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
