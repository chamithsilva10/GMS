"use client"

import { CheckCircle, Clock, AlertCircle, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface WorkflowStepProps {
  step: {
    id: string
    title: string
    description: string
    status: "pending" | "in_progress" | "completed" | "rejected"
    assignee?: string
    dueDate?: string
    completedAt?: string
  }
  isLast?: boolean
}

export function WorkflowStep({ step, isLast = false }: WorkflowStepProps) {
  const getStatusIcon = () => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-500" />
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getStatusColor = () => {
    switch (step.status) {
      case "completed":
        return "bg-green-500"
      case "in_progress":
        return "bg-blue-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        {getStatusIcon()}
        {!isLast && <div className={cn("w-0.5 h-16 mt-2", getStatusColor())} />}
      </div>
      <div className="flex-1 pb-8">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">{step.title}</h4>
          <Badge
            variant={
              step.status === "completed"
                ? "default"
                : step.status === "in_progress"
                  ? "secondary"
                  : step.status === "rejected"
                    ? "destructive"
                    : "outline"
            }
          >
            {step.status.replace("_", " ")}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mb-2">{step.description}</p>
        {step.assignee && (
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <User className="w-4 h-4 mr-1" />
            Assigned to: {step.assignee}
          </div>
        )}
        {step.dueDate && (
          <div className="text-sm text-gray-500">Due: {new Date(step.dueDate).toLocaleDateString()}</div>
        )}
        {step.completedAt && (
          <div className="text-sm text-green-600">Completed: {new Date(step.completedAt).toLocaleDateString()}</div>
        )}
      </div>
    </div>
  )
}
