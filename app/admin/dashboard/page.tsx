"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchBar } from "@/components/ui/search-bar"
import { DataAnalytics } from "@/components/ui/data-analytics"
import { AuditTrail } from "@/components/ui/audit-trail"
import { useNotifications } from "@/components/notification-system"
import {
  Users,
  FileText,
  Settings,
  Bell,
  LogOut,
  User,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Shield,
} from "lucide-react"
import { GrantDetailsModal } from "@/components/ui/grant-details-modal"

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [grants, setGrants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { addNotification } = useNotifications()
  const [selectedGrant, setSelectedGrant] = useState<any>(null)
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("ncas_current_user")
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData.role !== "admin") {
      router.push(`/${userData.role === "grant_manager" ? "manager" : "applicant"}/dashboard`)
      return
    }

    setUser(userData)

    // Load users data
    const usersData = JSON.parse(localStorage.getItem("ncas_users") || "[]")
    setUsers(usersData)

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

  const handleUserStatusChange = (userId: string, status: "approved" | "rejected") => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, status }
      }
      return u
    })

    setUsers(updatedUsers)
    localStorage.setItem("ncas_users", JSON.stringify(updatedUsers))

    // Log the action
    const auditLogs = JSON.parse(localStorage.getItem("ncas_audit_logs") || "[]")
    const targetUser = users.find((u) => u.id === userId)
    auditLogs.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      action: `user_${status}`,
      resource: "user",
      resourceId: userId,
      details: `User ${targetUser.email} has been ${status}`,
      ipAddress: "192.168.1.1",
      userAgent: navigator.userAgent,
      status: "success",
    })
    localStorage.setItem("ncas_audit_logs", JSON.stringify(auditLogs))

    addNotification({
      type: "success",
      title: "User Updated",
      message: `User has been ${status === "approved" ? "approved" : "rejected"}.`,
    })
  }

  // Handler to open modal
  const handleViewDetails = (grant: any) => {
    setSelectedGrant(grant)
    setIsGrantModalOpen(true)
  }

  // Handler to assign reviewer
  const handleAssignReviewer = (grantId: string, reviewerId: string) => {
    const updatedGrants = grants.map((g) =>
      g.id === grantId ? { ...g, reviewer: reviewerId } : g
    )
    setGrants(updatedGrants)
    localStorage.setItem("ncas_grants", JSON.stringify(updatedGrants))
  }

  // Handler to update grant status
  const handleUpdateGrantStatus = (grantId: string, status: string) => {
    const updatedGrants = grants.map((g) =>
      g.id === grantId ? { ...g, status } : g
    )
    setGrants(updatedGrants)
    localStorage.setItem("ncas_grants", JSON.stringify(updatedGrants))
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

  const pendingUsers = users.filter((u) => u.status === "pending")
  const approvedGrants = grants.filter((g) => g.status === "approved")
  const pendingGrants = grants.filter((g) => g.status === "pending")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <img src="/images/ncas-logo.png" alt="NCAS" className="h-8 w-8 sm:h-10 sm:w-10 object-contain mr-3" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">NCAS Grant Management</h1>
                <p className="text-xs sm:text-sm text-gray-500">Administrator Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-5 w-5" />
                <span>
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-transparent text-xs sm:text-sm"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Card */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Welcome, {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center">
                <div className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Administrator
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-4 flex justify-between items-center">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-lg sm:text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 flex justify-between items-center">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Pending Approvals</p>
                <p className="text-lg sm:text-2xl font-bold">{pendingUsers.length}</p>
              </div>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-amber-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 flex justify-between items-center">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Grants</p>
                <p className="text-lg sm:text-2xl font-bold">{grants.length}</p>
              </div>
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 flex justify-between items-center">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Approved Funding</p>
                <p className="text-lg sm:text-2xl font-bold">
                  ${approvedGrants.reduce((sum, grant) => sum + grant.amount, 0).toLocaleString()}
                </p>
              </div>
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="users" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <TabsList className="grid w-full grid-cols-3 sm:flex sm:w-auto">
              <TabsTrigger value="users" className="flex items-center text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Users</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
              <TabsTrigger value="grants" className="flex items-center text-xs sm:text-sm">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Grants</span>
                <span className="sm:hidden">Grants</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center text-xs sm:text-sm">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
            </TabsList>
            <div className="w-full sm:w-auto">
              <SearchBar 
                placeholder="Search..." 
                onSearch={(query, filters) => {
                  console.log('Search query:', query, 'Filters:', filters)
                  addNotification({
                    type: "info",
                    title: "Search",
                    message: `Searching for: ${query}`,
                  })
                }}
              />
            </div>
          </div>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">User Management</CardTitle>
                <CardDescription className="text-sm">Manage system users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                    <h3 className="text-base sm:text-lg font-medium">Pending Approval Requests</h3>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      View All Users
                    </Button>
                  </div>

                  {pendingUsers.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 border rounded-lg">
                      <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                      <h3 className="text-base sm:text-lg font-medium text-gray-900">No pending requests</h3>
                      <p className="text-sm text-gray-500 mt-1">All user requests have been processed</p>
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Email
                              </th>
                              <th
                                scope="col"
                                className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Role
                              </th>
                              <th
                                scope="col"
                                className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Organization
                              </th>
                              <th
                                scope="col"
                                className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {pendingUsers.map((user) => (
                              <tr key={user.id}>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                  <div className="text-xs sm:text-sm font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                  </div>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                  <div className="text-xs sm:text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {user.role === "grant_manager"
                                      ? "Grant Manager"
                                      : user.role === "admin"
                                        ? "Administrator"
                                        : "Applicant"}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{user.organization}</td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                                  <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleUserStatusChange(user.id, "approved")}
                                      className="bg-green-600 hover:bg-green-700 text-xs"
                                    >
                                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleUserStatusChange(user.id, "rejected")}
                                      className="text-xs"
                                    >
                                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 sm:mt-8">
                    <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Recent User Activity</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                User
                              </th>
                              <th
                                scope="col"
                                className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Action
                              </th>
                              <th
                                scope="col"
                                className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Time
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {JSON.parse(localStorage.getItem("ncas_audit_logs") || "[]")
                              .slice(0, 5)
                              .map((log: any) => (
                                <tr key={log.id}>
                                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                    <div className="text-xs sm:text-sm font-medium text-gray-900">{log.userName}</div>
                                    <div className="text-xs text-gray-500">{log.userRole}</div>
                                  </td>
                                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                    <div className="text-xs sm:text-sm text-gray-900">
                                      {log.action
                                        .replace(/_/g, " ")
                                        .split(" ")
                                        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(" ")}
                                    </div>
                                  </td>
                                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                    {new Date(log.timestamp).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grants Tab */}
          <TabsContent value="grants" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Grant Applications</CardTitle>
                <CardDescription className="text-sm">Review and manage grant applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                    <h3 className="text-base sm:text-lg font-medium">Pending Applications</h3>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      View All Grants
                    </Button>
                  </div>

                  {pendingGrants.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 border rounded-lg">
                      <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                      <h3 className="text-base sm:text-lg font-medium text-gray-900">No pending applications</h3>
                      <p className="text-sm text-gray-500 mt-1">All grant applications have been processed</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingGrants.map((grant) => (
                        <div key={grant.id} className="border rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
                            <div>
                              <h3 className="text-base sm:text-lg font-medium text-gray-900">{grant.title}</h3>
                              <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-500 mt-1 space-y-1 sm:space-y-0">
                                <span>{grant.applicantName}</span>
                                <span className="hidden sm:inline mx-2">•</span>
                                <span>{grant.organization}</span>
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-0">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending Review
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                            <div>
                              <span className="text-gray-500">Amount:</span>
                              <span className="ml-1 font-medium">${grant.amount.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Duration:</span>
                              <span className="ml-1 font-medium">{grant.duration}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Submitted:</span>
                              <span className="ml-1 font-medium">{new Date(grant.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Button size="sm" onClick={() => handleViewDetails(grant)} className="text-xs">View Details</Button>
                            <Button size="sm" variant="outline" onClick={() => handleAssignReviewer(grant.id, prompt('Enter Reviewer ID:'))} className="text-xs">
                              Assign Reviewer
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Grant Details Modal */}
                  <GrantDetailsModal
                    grant={selectedGrant}
                    isOpen={isGrantModalOpen}
                    onClose={() => setIsGrantModalOpen(false)}
                    onAssignReviewer={handleAssignReviewer}
                    onUpdateStatus={handleUpdateGrantStatus}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <DataAnalytics 
              data={{
                totalApplications: grants.length,
                approvedApplications: grants.filter(g => g.status === "approved").length,
                rejectedApplications: grants.filter(g => g.status === "rejected").length,
                pendingApplications: grants.filter(g => g.status === "pending").length,
                totalFunding: grants.filter(g => g.status === "approved").reduce((sum, g) => sum + (g.amount || 0), 0),
                averageProcessingTime: grants.length > 0 ? Math.round(grants.reduce((sum, g) => sum + ((g.decisionDate && g.createdAt) ? (new Date(g.decisionDate).getTime() - new Date(g.createdAt).getTime()) / (1000 * 60 * 60 * 24) : 0), 0) / grants.length) : 0,
                topCategories: (() => {
                  const catMap: Record<string, number> = {}
                  grants.forEach(g => { if (g.category) catMap[g.category] = (catMap[g.category] || 0) + 1 })
                  const total = grants.length
                  return Object.entries(catMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([category, count]) => ({
                      category,
                      count,
                      percentage: total > 0 ? Math.round((count / total) * 100) : 0
                    }))
                })(),
                monthlyTrends: (() => {
                  const trends: Record<string, { applications: number, funding: number }> = {}
                  grants.forEach(g => {
                    if (g.createdAt) {
                      const d = new Date(g.createdAt)
                      const month = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
                      if (!trends[month]) trends[month] = { applications: 0, funding: 0 }
                      trends[month].applications += 1
                      if (g.status === "approved") trends[month].funding += g.amount || 0
                    }
                  })
                  return Object.entries(trends).map(([month, v]) => ({ month, ...v }))
                })(),
              }}
            />
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit">
            <AuditTrail 
              logs={JSON.parse(localStorage.getItem("ncas_audit_logs") || "[]")}
              onExport={() => {
                addNotification({
                  type: "info",
                  title: "Export Started",
                  message: "Audit logs export has been initiated.",
                })
              }}
            />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">General Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">System Maintenance Mode</div>
                          <div className="text-sm text-gray-500">
                            Enable maintenance mode to prevent users from accessing the system
                          </div>
                        </div>
                        <Button variant="outline">Disable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Auto-approve New Applicants</div>
                          <div className="text-sm text-gray-500">Automatically approve new applicant registrations</div>
                        </div>
                        <Button variant="outline">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-gray-500">
                            Send email notifications for system events and updates
                          </div>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Two-Factor Authentication</div>
                          <div className="text-sm text-gray-500">
                            Require two-factor authentication for all admin users
                          </div>
                        </div>
                        <Button variant="outline">Enabled</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Password Policy</div>
                          <div className="text-sm text-gray-500">Configure password requirements and expiration</div>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Session Timeout</div>
                          <div className="text-sm text-gray-500">Set the session timeout period</div>
                        </div>
                        <Button variant="outline">30 minutes</Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button>Save Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
