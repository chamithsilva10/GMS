"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { NotificationToast } from "@/components/ui/notification-toast"

interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  duration?: number
}

interface NotificationContextType {
  addNotification: (notification: Omit<Notification, "id">) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    setNotifications((prev) => [...prev, { ...notification, id }])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Listen for global events
  useEffect(() => {
    const handleUserRegistered = (event: any) => {
      addNotification({
        type: "info",
        title: "New User Registration",
        message: `${event.detail.firstName} ${event.detail.lastName} has registered and is pending approval.`,
      })
    }

    const handleGrantSubmitted = (event: any) => {
      addNotification({
        type: "info",
        title: "New Grant Application",
        message: `Grant application "${event.detail.title}" has been submitted for review.`,
      })
    }

    const handleUserStatusChanged = (event: any) => {
      addNotification({
        type: event.detail.action === "approve" ? "success" : "warning",
        title: "User Status Updated",
        message: `User has been ${event.detail.action}d.`,
      })
    }

    const handleGrantStatusChanged = (event: any) => {
      addNotification({
        type: event.detail.action === "approve" ? "success" : "warning",
        title: "Grant Status Updated",
        message: `Grant application has been ${event.detail.action}d.`,
      })
    }

    window.addEventListener("userRegistered", handleUserRegistered)
    window.addEventListener("grantSubmitted", handleGrantSubmitted)
    window.addEventListener("userStatusChanged", handleUserStatusChanged)
    window.addEventListener("grantStatusChanged", handleGrantStatusChanged)

    return () => {
      window.removeEventListener("userRegistered", handleUserRegistered)
      window.removeEventListener("grantSubmitted", handleGrantSubmitted)
      window.removeEventListener("userStatusChanged", handleUserStatusChanged)
      window.removeEventListener("grantStatusChanged", handleGrantStatusChanged)
    }
  }, [])

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <NotificationToast key={notification.id} {...notification} onClose={removeNotification} />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
