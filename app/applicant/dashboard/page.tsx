"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { SearchBar } from "@/components/ui/search-bar"
import { WorkflowStep } from "@/components/ui/workflow-step"
import { FileUpload } from "@/components/ui/file-upload"
import { useNotifications } from "@/components/notification-system"
import { GrantPortal } from "@/components/ui/grant-portal"
import { BillTracker } from "@/components/ui/bill-tracker"
import { ChatSupport } from "@/components/ui/chat-support"
import {
  CalendarDays,
  FileText,
  Clock,
  DollarSign,
  BarChart3,
  CheckCircle,
  AlertCircle,
  ClipboardList,
  Bell,
  LogOut,
  User,
} from "lucide-react"

export default function ApplicantDashboard() {
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
    if (userData.role !== "applicant") {
      router.push(`/${userData.role}/dashboard`)
      return
    }

    setUser(userData)

    // Load grants data
    const grantsData = JSON.parse(localStorage.getItem("ncas_grants") || "[]")
    const userGrants = grantsData.filter((grant: any) => grant.applicantId === userData.id)
    setGrants(userGrants)
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
                <p className="text-sm text-gray-500">Applicant Dashboard</p>
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-600 mt-1">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button onClick={() => router.push("/applicant/apply")}>New Grant Application</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="applications" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="portal" className="flex items-center">
                <ClipboardList className="h-4 w-4 mr-2" />
                Grant Portal
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Support
              </TabsTrigger>
            </TabsList>
            <SearchBar placeholder="Search applications..." />
          </div>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            {/* Application Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Applications</p>
                    <p className="text-2xl font-bold">{grants.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending Review</p>
                    <p className="text-2xl font-bold">{grants.filter((grant) => grant.status === "pending").length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-500" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Approved</p>
                    <p className="text-2xl font-bold">{grants.filter((grant) => grant.status === "approved").length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Funding</p>
                    <p className="text-2xl font-bold">
                      $
                      {grants
                        .filter((grant) => grant.status === "approved")
                        .reduce((sum, grant) => sum + grant.amount, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-emerald-600" />
                </CardContent>
              </Card>
            </div>

            {/* Applications List */}
            <Card>
              <CardHeader>
                <CardTitle>Your Grant Applications</CardTitle>
                <CardDescription>Track and manage your grant applications</CardDescription>
              </CardHeader>
              <CardContent>
                {grants.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
                    <p className="text-gray-500 mt-1">Start by creating your first grant application</p>
                    <Button onClick={() => router.push("/applicant/apply")} className="mt-4">
                      New Application
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {grants.map((grant) => (
                      <div key={grant.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row justify-between md:items-center">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{grant.title}</h3>
                            <p className="text-sm text-gray-500">
                              Submitted on {new Date(grant.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 md:mt-0 flex items-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                grant.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : grant.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {grant.status === "approved"
                                ? "Approved"
                                : grant.status === "rejected"
                                  ? "Rejected"
                                  : "Under Review"}
                            </span>
                            <Button variant="ghost" size="sm" className="ml-2">
                              View Details
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Application Progress</span>
                            <span className="text-gray-700 font-medium">
                              {grant.status === "approved" ? "100%" : grant.status === "rejected" ? "Rejected" : "60%"}
                            </span>
                          </div>
                          <Progress
                            value={grant.status === "approved" ? 100 : grant.status === "rejected" ? 0 : 60}
                            className="h-2"
                          />
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center text-sm">
                            <CalendarDays className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-gray-500">Duration:</span>
                            <span className="ml-1 font-medium">{grant.duration}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-gray-500">Amount:</span>
                            <span className="ml-1 font-medium">${grant.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <BarChart3 className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-gray-500">Category:</span>
                            <span className="ml-1 font-medium capitalize">{grant.category}</span>
                          </div>
                        </div>

                        {grant.status === "pending" && (
                          <div className="mt-4">
                            {[
                              { id: "1", title: "Submitted", description: "Your application has been submitted.", status: "completed" },
                              { id: "2", title: "Initial Review", description: "Initial review by admin.", status: "completed" },
                              { id: "3", title: "Technical Review", description: "Technical review in progress.", status: "in_progress" },
                              { id: "4", title: "Final Decision", description: "Awaiting final decision.", status: "pending" },
                            ].map((step, idx, arr) => (
                              <WorkflowStep key={step.id} step={step} isLast={idx === arr.length - 1} />
                            ))}
                          </div>
                        )}

                        {grant.status === "approved" && (
                          <div className="mt-4 border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Required Documents</h4>
                            <FileUpload
                              label="Upload Progress Report"
                              description="Please submit your quarterly progress report"
                              accept=".pdf,.doc,.docx"
                              onUpload={(file) => {
                                addNotification({
                                  type: "success",
                                  title: "File Uploaded",
                                  message: `${file.name} has been successfully uploaded.`,
                                })
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grant Portal Tab */}
          <TabsContent value="portal">
            <GrantPortal />
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <BillTracker 
              bills={[]} 
              onAddBill={(bill) => {
                addNotification({
                  type: "success",
                  title: "Bill Added",
                  message: `Bill "${bill.description}" has been added successfully.`,
                })
              }}
              onDownloadPDF={(billId) => {
                addNotification({
                  type: "info",
                  title: "Download Started",
                  message: "PDF download has been initiated.",
                })
              }}
            />
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support">
            <ChatSupport />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
