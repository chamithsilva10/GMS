"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/components/notification-system"
import { Bell, LogOut, User } from "lucide-react"

export default function ManagerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [grants, setGrants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { addNotification } = useNotifications()

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("ncas_current_user")
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData.role !== "grant_manager") {
      router.push(`/${userData.role === "admin" ? "admin" : "applicant"}/dashboard`)
      return
    }

    setUser(userData)

    // Load grants data
    const grantsData = JSON.parse(localStorage.getItem("ncas_grants") || "[]")
    setGrants(grantsData)

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("ncas_current_user")
    addNotification({
      type: "info",
      title: "Logged Out",
      message: "You have been successfully logged out.",
    })
    router.push("/auth/login")
  }

  const handleGrantStatusChange = (grantId: string, status: "approved" | "rejected") => {
    const updatedGrants = grants.map((g) => {
      if (g.id === grantId) {
        return { ...g, status, updatedAt: new Date().toISOString() }
      }
      return g
    })

    setGrants(updatedGrants)
    localStorage.setItem("ncas_grants", JSON.stringify(updatedGrants))

    // Log the action
    const auditLogs = JSON.parse(localStorage.getItem("ncas_audit_logs") || "[]")
    const targetGrant = grants.find((g) => g.id === grantId)
    auditLogs.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      action: `grant_${status}`,
      resource: "grant",
      resourceId: grantId,
      details: `Grant "${targetGrant.title}" has been ${status}`,
      ipAddress: "192.168.1.1",
      userAgent: navigator.userAgent,
      status: "success",
    })
    localStorage.setItem("ncas_audit_logs", JSON.stringify(auditLogs))

    addNotification({
      type: "success",
      title: "Grant Updated",
      message: `Grant has been ${status === "approved" ? "approved" : "rejected"}.`,
    })
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const pendingGrants = grants.filter((g) => g.status === "pending")
  const approvedGrants = grants.filter((g) => g.status === "approved")
  const rejectedGrants = grants.filter((g) => g.status === "rejected")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="/images/ncas-logo.png" alt="NCAS" className="h-10 w-10 object-contain mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">NCAS Grant Management</h1>
                <p className="text-sm text-gray-500">Grant Manager Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-5 w-5" />
                <span>
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center space-x-1 bg-transparent">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>\
