"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Database, Users, FileText, Settings } from "lucide-react"

export default function SetupPage() {
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [setupSteps, setSetupSteps] = useState([
    { id: 1, name: "Initialize Database", icon: Database, completed: false },
    { id: 2, name: "Create Demo Users", icon: Users, completed: false },
    { id: 3, name: "Setup Grant Applications", icon: FileText, completed: false },
    { id: 4, name: "Configure System Settings", icon: Settings, completed: false },
  ])
  const router = useRouter()

  useEffect(() => {
    // Check if setup is already complete
    const existingUsers = localStorage.getItem("ncas_users")
    if (existingUsers) {
      setIsSetupComplete(true)
      setSetupSteps((steps) => steps.map((step) => ({ ...step, completed: true })))
    }
  }, [])

  const runSetup = async () => {
    setIsLoading(true)

    try {
      // Step 1: Initialize Database
      setSetupSteps((steps) => steps.map((step) => (step.id === 1 ? { ...step, completed: true } : step)))
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 2: Create Demo Users
      const demoUsers = [
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
        {
          id: "4",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@research.org",
          password: "password123",
          role: "applicant",
          organization: "Research Institute",
          phone: "+1-555-0004",
          status: "pending",
          createdAt: new Date().toISOString(),
          mfaEnabled: false,
        },
      ]

      localStorage.setItem("ncas_users", JSON.stringify(demoUsers))

      setSetupSteps((steps) => steps.map((step) => (step.id === 2 ? { ...step, completed: true } : step)))
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 3: Setup Grant Applications
      const demoGrants = [
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
          objectives: "1. Create accurate diagnostic tools\n2. Reduce healthcare costs\n3. Improve patient outcomes",
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
          objectives: "1. Develop efficient storage systems\n2. Reduce environmental impact\n3. Scale renewable energy",
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

      localStorage.setItem("ncas_grants", JSON.stringify(demoGrants))

      setSetupSteps((steps) => steps.map((step) => (step.id === 3 ? { ...step, completed: true } : step)))
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 4: Configure System Settings
      localStorage.setItem("ncas_audit_logs", JSON.stringify([]))
      localStorage.setItem("ncas_notifications", JSON.stringify([]))

      setSetupSteps((steps) => steps.map((step) => (step.id === 4 ? { ...step, completed: true } : step)))
      await new Promise((resolve) => setTimeout(resolve, 500))

      setIsSetupComplete(true)
    } catch (error) {
      console.error("Setup failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">NCAS Grant Management System</CardTitle>
          <CardDescription>Initialize your system with demo data</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isSetupComplete && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Setup completed successfully! You can now log in with the demo credentials.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {setupSteps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    step.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {step.completed ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={step.completed ? "text-green-700" : "text-gray-700"}>{step.name}</span>
                </div>
              )
            })}
          </div>

          {!isSetupComplete && (
            <Button onClick={runSetup} disabled={isLoading} className="w-full" size="lg">
              {isLoading ? "Setting up..." : "Initialize System"}
            </Button>
          )}

          {isSetupComplete && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Demo Login Credentials:</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-white p-2 rounded border">
                    <strong>Admin:</strong> admin@ncas.org / admin123 (MFA: 123456)
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <strong>Manager:</strong> manager@ncas.org / manager123 (MFA: 123456)
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <strong>Applicant:</strong> applicant@ncas.org / applicant123
                  </div>
                </div>
              </div>

              <Button onClick={() => router.push("/auth/login")} className="w-full" size="lg">
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
