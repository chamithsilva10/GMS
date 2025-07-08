"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUpload } from "@/components/ui/file-upload"
import { useNotifications } from "@/components/notification-system"
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function GrantApplicationPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    duration: "",
    description: "",
    objectives: "",
    methodology: "",
    budget: "",
    timeline: "",
    impact: "",
    sustainability: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [eligibilityCheck, setEligibilityCheck] = useState<any>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const router = useRouter()
  const { addNotification } = useNotifications()

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem("ncas_current_user")
    if (!user) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(user)
    if (parsedUser.role !== "applicant") {
      router.push("/auth/login")
      return
    }

    setCurrentUser(parsedUser)

    // GSAP Animation
    if (typeof window !== "undefined" && window.gsap) {
      window.gsap.fromTo(".form-card", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.2 })
    }
  }, [router])

  // Eligibility check when form data changes
  useEffect(() => {
    if (formData.amount && formData.category && currentUser) {
      performEligibilityCheck()
    }
  }, [formData.amount, formData.category, currentUser])

  const performEligibilityCheck = () => {
    const amount = Number.parseFloat(formData.amount)
    const checks = {
      amountValid: amount > 0 && amount <= 1000000, // Max $1M
      categoryValid: formData.category !== "",
      organizationValid: currentUser?.organization !== "",
      previousApplications: true, // Mock check
    }

    const isEligible = Object.values(checks).every((check) => check)

    setEligibilityCheck({
      isEligible,
      checks,
      message: isEligible
        ? "✅ Your application meets all eligibility requirements"
        : "❌ Please address the eligibility issues below",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(files)
    addNotification({
      type: "success",
      title: "Files Uploaded",
      message: `${files.length} file(s) uploaded successfully.`,
    })
  }

  const validateForm = () => {
    const errors = []

    if (!formData.title) errors.push("Project title is required")
    if (!formData.category) errors.push("Grant category is required")
    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) errors.push("Valid amount is required")
    if (!formData.description) errors.push("Project description is required")

    if (eligibilityCheck && !eligibilityCheck.isEligible) {
      errors.push("Please address eligibility requirements")
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "))
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call with progress
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create new grant application
      const newGrant = {
        id: Date.now().toString(),
        applicantId: currentUser.id,
        applicantName: `${currentUser.firstName} ${currentUser.lastName}`,
        applicantEmail: currentUser.email,
        organization: currentUser.organization,
        title: formData.title,
        category: formData.category,
        amount: Number.parseFloat(formData.amount),
        duration: formData.duration,
        description: formData.description,
        objectives: formData.objectives,
        methodology: formData.methodology,
        budget: formData.budget,
        timeline: formData.timeline,
        impact: formData.impact,
        sustainability: formData.sustainability,
        status: "pending",
        documents: uploadedFiles.map((f) => f.name),
        eligibilityPassed: eligibilityCheck?.isEligible || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workflow: {
          currentStep: "manager_review",
          steps: [
            { name: "submission", status: "completed", completedAt: new Date().toISOString() },
            { name: "eligibility_check", status: "completed", completedAt: new Date().toISOString() },
            { name: "manager_review", status: "pending", assignedTo: "grant_manager" },
            { name: "final_approval", status: "pending", assignedTo: "admin" },
          ],
        },
      }

      // Save to localStorage
      const grants = JSON.parse(localStorage.getItem("ncas_grants") || "[]")
      grants.push(newGrant)
      localStorage.setItem("ncas_grants", JSON.stringify(grants))

      // Trigger real-time update event
      window.dispatchEvent(new CustomEvent("grantSubmitted", { detail: newGrant }))

      addNotification({
        type: "success",
        title: "Application Submitted Successfully!",
        message: "Your grant application is now under review.",
      })

      setSuccess(true)
    } catch (error) {
      setError("An error occurred while submitting your application")
      addNotification({
        type: "error",
        title: "Submission Failed",
        message: "There was an error submitting your application. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <img src="/images/ncas-logo.png" alt="NCAS" className="w-8 h-8 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">NCAS Grant Application</h1>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Application Submitted!</CardTitle>
              <CardDescription>
                Your grant application has been successfully submitted and is now under review. You will receive email
                notifications about status updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">What happens next?</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p>✅ Eligibility check completed</p>
                  <p>⏳ Manager review (7-10 business days)</p>
                  <p>⏳ Final approval decision</p>
                  <p>📧 Email notification with results</p>
                </div>
              </div>
              <Link href="/applicant/dashboard">
                <Button>Return to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/applicant/dashboard" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <img src="/images/ncas-logo.png" alt="NCAS" className="w-8 h-8 mr-3" />
            <h1 className="text-xl font-semibold text-gray-900">New Grant Application</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Eligibility Check */}
          {eligibilityCheck && (
            <Card className="form-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {eligibilityCheck.isEligible ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  )}
                  Eligibility Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`p-4 rounded-lg ${eligibilityCheck.isEligible ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                >
                  <p className={`font-medium ${eligibilityCheck.isEligible ? "text-green-800" : "text-red-800"}`}>
                    {eligibilityCheck.message}
                  </p>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className={eligibilityCheck.checks.amountValid ? "text-green-700" : "text-red-700"}>
                      {eligibilityCheck.checks.amountValid ? "✅" : "❌"} Amount within limits ($1 - $1,000,000)
                    </div>
                    <div className={eligibilityCheck.checks.categoryValid ? "text-green-700" : "text-red-700"}>
                      {eligibilityCheck.checks.categoryValid ? "✅" : "❌"} Valid grant category selected
                    </div>
                    <div className={eligibilityCheck.checks.organizationValid ? "text-green-700" : "text-red-700"}>
                      {eligibilityCheck.checks.organizationValid ? "✅" : "❌"} Organization information complete
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Basic Information */}
          <Card className="form-card">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide basic details about your grant application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter project title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Grant Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="research">Research & Development</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="community">Community Development</SelectItem>
                      <SelectItem value="arts">Arts & Culture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Requested Amount ($) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Project Duration</Label>
                  <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-months">3 Months</SelectItem>
                      <SelectItem value="6-months">6 Months</SelectItem>
                      <SelectItem value="1-year">1 Year</SelectItem>
                      <SelectItem value="2-years">2 Years</SelectItem>
                      <SelectItem value="3-years">3 Years</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Description */}
          <Card className="form-card">
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
              <CardDescription>Describe your project in detail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Project Summary *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a comprehensive overview of your project..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objectives">Project Objectives</Label>
                <Textarea
                  id="objectives"
                  placeholder="List the main objectives and goals of your project..."
                  value={formData.objectives}
                  onChange={(e) => handleInputChange("objectives", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="methodology">Methodology</Label>
                <Textarea
                  id="methodology"
                  placeholder="Describe the methods and approaches you will use..."
                  value={formData.methodology}
                  onChange={(e) => handleInputChange("methodology", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Budget and Timeline */}
          <Card className="form-card">
            <CardHeader>
              <CardTitle>Budget & Timeline</CardTitle>
              <CardDescription>Provide budget breakdown and project timeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Breakdown</Label>
                <Textarea
                  id="budget"
                  placeholder="Provide detailed budget breakdown (personnel, equipment, materials, etc.)..."
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline">Project Timeline</Label>
                <Textarea
                  id="timeline"
                  placeholder="Outline key milestones and timeline for project completion..."
                  value={formData.timeline}
                  onChange={(e) => handleInputChange("timeline", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Impact and Sustainability */}
          <Card className="form-card">
            <CardHeader>
              <CardTitle>Impact & Sustainability</CardTitle>
              <CardDescription>Describe the expected impact and long-term sustainability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="impact">Expected Impact</Label>
                <Textarea
                  id="impact"
                  placeholder="Describe the expected outcomes and impact of your project..."
                  value={formData.impact}
                  onChange={(e) => handleInputChange("impact", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sustainability">Sustainability Plan</Label>
                <Textarea
                  id="sustainability"
                  placeholder="How will you ensure the long-term sustainability of this project?"
                  value={formData.sustainability}
                  onChange={(e) => handleInputChange("sustainability", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card className="form-card">
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
              <CardDescription>Upload any supporting documents (required for complete application)</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFileUpload={handleFileUpload}
                maxFiles={10}
                maxSize={25}
                acceptedTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".png", ".zip"]}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/applicant/dashboard">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isLoading || (eligibilityCheck && !eligibilityCheck.isEligible)}
              className="min-w-[150px]"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
