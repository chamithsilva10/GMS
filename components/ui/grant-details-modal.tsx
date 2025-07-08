"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useNotifications } from "@/components/notification-system"
import {
  Download,
  User,
  Calendar,
  DollarSign,
  FileText,
  Building,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

interface GrantDetailsModalProps {
  grant: any
  isOpen: boolean
  onClose: () => void
  onAssignReviewer: (grantId: string, reviewerId: string) => void
  onUpdateStatus: (grantId: string, status: string) => void
}

export function GrantDetailsModal({
  grant,
  isOpen,
  onClose,
  onAssignReviewer,
  onUpdateStatus,
}: GrantDetailsModalProps) {
  const [selectedReviewer, setSelectedReviewer] = useState("")
  const { addNotification } = useNotifications()

  if (!grant) return null

  // Mock reviewers data - in real app, this would come from API
  const reviewers = [
    { id: "1", name: "Dr. Sarah Johnson", email: "sarah.johnson@ncas.org", expertise: "Research & Development" },
    { id: "2", name: "Prof. Michael Chen", email: "michael.chen@ncas.org", expertise: "Technology & Innovation" },
    { id: "3", name: "Dr. Emily Rodriguez", email: "emily.rodriguez@ncas.org", expertise: "Environmental Science" },
    { id: "4", name: "Prof. David Thompson", email: "david.thompson@ncas.org", expertise: "Business & Economics" },
  ]

  // Mock uploaded files - in real app, this would come from the grant data
  const uploadedFiles = [
    { id: "1", name: "Project_Proposal.pdf", type: "pdf", size: "2.4 MB", uploadedAt: "2024-01-15" },
    { id: "2", name: "Budget_Spreadsheet.xlsx", type: "excel", size: "1.8 MB", uploadedAt: "2024-01-15" },
    { id: "3", name: "Team_Resumes.pdf", type: "pdf", size: "3.2 MB", uploadedAt: "2024-01-16" },
    { id: "4", name: "Technical_Specifications.docx", type: "word", size: "1.5 MB", uploadedAt: "2024-01-16" },
  ]

  const handleAssignReviewer = () => {
    if (selectedReviewer) {
      onAssignReviewer(grant.id, selectedReviewer)
      addNotification({
        type: "success",
        title: "Reviewer Assigned",
        message: "Reviewer has been successfully assigned to this grant application.",
      })
      setSelectedReviewer("")
    }
  }

  const handleDownloadFile = (file: any) => {
    // In a real app, this would trigger an actual file download
    addNotification({
      type: "info",
      title: "Download Started",
      message: `Downloading ${file.name}...`,
    })
    
    // Simulate file download
    const link = document.createElement("a")
    link.href = "#" // In real app, this would be the actual file URL
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            Grant Application Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Grant Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{grant.title}</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">{grant.description}</p>
            </div>
            <Badge className={`flex items-center gap-1 text-xs sm:text-sm ${getStatusColor(grant.status)}`}>
              {getStatusIcon(grant.status)}
              {grant.status.charAt(0).toUpperCase() + grant.status.slice(1)}
            </Badge>
          </div>

          <Separator />

          {/* Applicant Information */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Applicant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">{grant.applicantName}</h4>
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1 mt-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                      {grant.applicantEmail || "email@example.com"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                      {grant.applicantPhone || "+1 (555) 123-4567"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-3 w-3 sm:h-4 sm:w-4" />
                      {grant.organization}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                      {grant.location || "City, State"}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Project Details</h4>
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-medium capitalize">{grant.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{grant.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount Requested:</span>
                      <span className="font-medium">${grant.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Submitted:</span>
                      <span className="font-medium">{new Date(grant.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Description */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Project Description</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {grant.description || "This is a comprehensive project description that outlines the objectives, methodology, expected outcomes, and impact of the proposed research or initiative. The project aims to address key challenges in the field and contribute to scientific advancement and societal benefit."}
              </p>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                Uploaded Documents
              </CardTitle>
              <CardDescription className="text-sm">Files submitted by the applicant</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900 text-sm sm:text-base">{file.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {file.size} • Uploaded {file.uploadedAt}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadFile(file)}
                      className="flex items-center gap-2 text-xs sm:text-sm"
                    >
                      <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviewer Assignment */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Reviewer Assignment</CardTitle>
              <CardDescription className="text-sm">Assign a reviewer to evaluate this application</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700">Select Reviewer</label>
                    <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose a reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        {reviewers.map((reviewer) => (
                          <SelectItem key={reviewer.id} value={reviewer.id}>
                            <div>
                              <div className="font-medium text-sm sm:text-base">{reviewer.name}</div>
                              <div className="text-xs sm:text-sm text-gray-500">{reviewer.expertise}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAssignReviewer} disabled={!selectedReviewer} className="text-xs sm:text-sm">
                      Assign Reviewer
                    </Button>
                  </div>
                </div>

                {grant.reviewer && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-xs sm:text-sm font-medium text-blue-900">Currently Assigned</div>
                    <div className="text-xs sm:text-sm text-blue-700 mt-1">
                      {reviewers.find(r => r.id === grant.reviewer)?.name || "Unknown Reviewer"}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t space-y-2 sm:space-y-0">
            <Button variant="outline" onClick={onClose} className="text-xs sm:text-sm">
              Close
            </Button>
            {grant.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus(grant.id, "rejected")}
                  className="text-red-600 border-red-600 hover:bg-red-50 text-xs sm:text-sm"
                >
                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => onUpdateStatus(grant.id, "approved")}
                  className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 