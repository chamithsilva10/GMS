"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MultiFactorAuth } from "@/components/ui/multi-factor-auth"
import { useNotifications } from "@/components/notification-system"
import { Eye, EyeOff, Shield } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showMFA, setShowMFA] = useState(false)
  const [mfaMethod, setMfaMethod] = useState<"sms" | "email" | "app">("email")
  const [pendingUser, setPendingUser] = useState<any>(null)
  const router = useRouter()
  const { addNotification } = useNotifications()

  // Initialize default users if they don't exist
  useEffect(() => {
    const initializeDefaultUsers = () => {
      const existingUsers = localStorage.getItem("ncas_users")
      if (!existingUsers) {
        const defaultUsers = [
          {
            id: "1",
            firstName: "System",
            lastName: "Administrator",
            email: "admin@ncas.org",
            password: "admin123",
            role: "admin",
            organization: "NCAS",
            phone: "+1-555-0001",
            status: "approved",
            createdAt: new Date().toISOString(),
            mfaEnabled: true,
          },
          {
            id: "2",
            firstName: "Grant",
            lastName: "Manager",
            email: "manager@ncas.org",
            password: "manager123",
            role: "grant_manager",
            organization: "NCAS",
            phone: "+1-555-0002",
            status: "approved",
            createdAt: new Date().toISOString(),
            mfaEnabled: true,
          },
          {
            id: "3",
            firstName: "John",
            lastName: "Applicant",
            email: "applicant@ncas.org",
            password: "applicant123",
            role: "applicant",
            organization: "Demo University",
            phone: "+1-555-0003",
            status: "approved",
            createdAt: new Date().toISOString(),
            mfaEnabled: false,
          },
        ]
        localStorage.setItem("ncas_users", JSON.stringify(defaultUsers))

        // Initialize audit logs if they don't exist
        if (!localStorage.getItem("ncas_audit_logs")) {
          localStorage.setItem("ncas_audit_logs", JSON.stringify([]))
        }

        // Initialize grants if they don't exist
        if (!localStorage.getItem("ncas_grants")) {
          const defaultGrants = [
            {
              id: "1",
              applicantId: "3",
              applicantName: "John Applicant",
              applicantEmail: "applicant@ncas.org",
              organization: "Demo University",
              title: "AI-Powered Healthcare Diagnostics",
              category: "healthcare",
              amount: 250000,
              duration: "2-years",
              description: "Development of an AI system for early disease detection using medical imaging.",
              objectives:
                "1. Create accurate diagnostic tools\n2. Reduce healthcare costs\n3. Improve patient outcomes",
              methodology: "Machine learning algorithms, clinical trials, and data analysis",
              budget: "Personnel: $150,000\nEquipment: $75,000\nMaterials: $25,000",
              timeline: "Year 1: Development and testing\nYear 2: Clinical trials and validation",
              impact: "Improve diagnostic accuracy by 30% and reduce healthcare costs by 20%",
              sustainability: "Licensing to healthcare providers and ongoing maintenance contracts",
              status: "pending",
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "2",
              applicantId: "3",
              applicantName: "John Applicant",
              applicantEmail: "applicant@ncas.org",
              organization: "Demo University",
              title: "Sustainable Energy Storage Solutions",
              category: "environment",
              amount: 180000,
              duration: "18-months",
              description: "Research into next-generation battery technology for renewable energy storage.",
              objectives:
                "1. Develop efficient storage systems\n2. Reduce environmental impact\n3. Scale renewable energy",
              methodology: "Materials science research, prototype development, performance testing",
              budget: "Personnel: $100,000\nMaterials: $50,000\nEquipment: $30,000",
              timeline: "Months 1-6: Research\nMonths 7-12: Development\nMonths 13-18: Testing",
              impact: "Increase energy storage efficiency by 40% and reduce carbon footprint",
              sustainability: "Technology transfer to industry partners and patent licensing",
              status: "approved",
              createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ]
          localStorage.setItem("ncas_grants", JSON.stringify(defaultGrants))
        }
      }
    }

    initializeDefaultUsers()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("ncas_users") || "[]")
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (!user) {
        setError("Invalid email or password")

        // Log failed login attempt
        const auditLogs = JSON.parse(localStorage.getItem("ncas_audit_logs") || "[]")
        auditLogs.push({
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          userId: "unknown",
          userName: email,
          userRole: "unknown",
          action: "login_failed",
          resource: "authentication",
          resourceId: "",
          details: `Failed login attempt for email: ${email}`,
          ipAddress: "192.168.1.1",
          userAgent: navigator.userAgent,
          status: "failed",
        })
        localStorage.setItem("ncas_audit_logs", JSON.stringify(auditLogs))
        return
      }

      if (user.status === "pending") {
        setError("Your account is pending admin approval. Please wait for approval.")
        return
      }

      if (user.status === "rejected") {
        setError("Your account has been rejected. Please contact support.")
        return
      }

      // Check if MFA is enabled for admin and manager roles
      if (user.mfaEnabled && (user.role === "admin" || user.role === "grant_manager")) {
        setPendingUser(user)
        setShowMFA(true)
        addNotification({
          type: "info",
          title: "Two-Factor Authentication Required",
          message: "Please verify your identity with the code sent to your registered email.",
        })
        return
      }

      // Complete login for users without MFA
      completeLogin(user)
    } catch (error) {
      setError("An error occurred during login")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMFAVerify = async (code: string) => {
    try {
      // Simulate MFA verification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock verification - accept any 6-digit code for demo
      if (code.length === 6) {
        completeLogin(pendingUser)
        addNotification({
          type: "success",
          title: "Login Successful",
          message: "Two-factor authentication verified successfully.",
        })
      } else {
        throw new Error("Please enter a 6-digit verification code")
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleMFAResend = () => {
    addNotification({
      type: "info",
      title: "Code Resent",
      message: "A new verification code has been sent to your registered email.",
    })
  }

  const completeLogin = (user: any) => {
    // Store user session
    localStorage.setItem("ncas_current_user", JSON.stringify(user))

    // Log successful login
    const auditLogs = JSON.parse(localStorage.getItem("ncas_audit_logs") || "[]")
    auditLogs.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      action: "login_success",
      resource: "authentication",
      resourceId: user.id,
      details: `Successful login from ${navigator.userAgent}`,
      ipAddress: "192.168.1.1",
      userAgent: navigator.userAgent,
      status: "success",
    })
    localStorage.setItem("ncas_audit_logs", JSON.stringify(auditLogs))

    // Show success notification
    addNotification({
      type: "success",
      title: "Welcome Back!",
      message: `Successfully logged in as ${user.firstName} ${user.lastName}`,
    })

    // Redirect based on role
    if (user.role === "admin") {
      router.push("/admin/dashboard")
    } else if (user.role === "grant_manager") {
      router.push("/manager/dashboard")
    } else {
      router.push("/applicant/dashboard")
    }
  }

  if (showMFA) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <MultiFactorAuth
          onVerify={handleMFAVerify}
          onResend={handleMFAResend}
          method={mfaMethod}
          isLoading={isLoading}
          error={error}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/images/ncas-logo.png" alt="NCAS" className="w-20 h-20 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">NCAS</CardTitle>
          <CardDescription>Grant Management System</CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
              <div className="flex items-center space-x-1 text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Secure Login</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">{"Don't have an account? "}</span>
              <Link href="/auth/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
