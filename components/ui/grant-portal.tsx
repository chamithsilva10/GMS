"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, Search, Filter } from "lucide-react"

interface Grant {
  id: string
  title: string
  description: string
  category: string
  maxAmount: number
  deadline: string
  eligibility: string[]
  status: "open" | "closed" | "upcoming"
  applicants: number
  fundingBody: string
  requirements: string[]
}

interface GrantPortalProps {
  onApply: (grantId: string) => void
}

export function GrantPortal({ onApply }: GrantPortalProps) {
  const [grants, setGrants] = useState<Grant[]>([])
  const [filteredGrants, setFilteredGrants] = useState<Grant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    // Load available grants
    const availableGrants: Grant[] = [
      {
        id: "1",
        title: "Healthcare Innovation Grant 2024",
        description:
          "Supporting innovative healthcare solutions and medical technology development to improve patient outcomes and healthcare accessibility.",
        category: "healthcare",
        maxAmount: 500000,
        deadline: "2024-06-30",
        eligibility: [
          "Registered healthcare organizations",
          "Medical research institutions",
          "Healthcare technology companies",
        ],
        status: "open",
        applicants: 45,
        fundingBody: "National Health Foundation",
        requirements: [
          "Business registration",
          "Medical license",
          "Project proposal",
          "Budget breakdown",
          "Clinical trial approval",
        ],
      },
      {
        id: "2",
        title: "Education Technology Advancement",
        description:
          "Funding for educational technology projects that enhance learning experiences and improve educational outcomes for students.",
        category: "education",
        maxAmount: 250000,
        deadline: "2024-07-15",
        eligibility: ["Educational institutions", "EdTech companies", "Non-profit organizations"],
        status: "open",
        applicants: 32,
        fundingBody: "Department of Education",
        requirements: [
          "Educational license",
          "Project proposal",
          "Impact assessment",
          "Budget plan",
          "Pilot study results",
        ],
      },
      {
        id: "3",
        title: "Environmental Sustainability Initiative",
        description:
          "Supporting projects focused on environmental conservation, renewable energy, and sustainable development practices.",
        category: "environment",
        maxAmount: 750000,
        deadline: "2024-08-01",
        eligibility: ["Environmental organizations", "Research institutions", "Green technology companies"],
        status: "open",
        applicants: 28,
        fundingBody: "Environmental Protection Agency",
        requirements: [
          "Environmental impact assessment",
          "Sustainability plan",
          "Technical specifications",
          "Community engagement plan",
        ],
      },
      {
        id: "4",
        title: "Small Business Development Fund",
        description:
          "Providing financial support to small businesses for expansion, innovation, and job creation in underserved communities.",
        category: "business",
        maxAmount: 100000,
        deadline: "2024-05-20",
        eligibility: ["Small businesses (< 50 employees)", "Startups", "Social enterprises"],
        status: "open",
        applicants: 67,
        fundingBody: "Small Business Administration",
        requirements: [
          "Business registration",
          "Financial statements",
          "Business plan",
          "Tax returns",
          "Employment records",
        ],
      },
      {
        id: "5",
        title: "Arts and Culture Preservation",
        description:
          "Supporting arts and cultural projects that preserve heritage, promote cultural diversity, and engage communities.",
        category: "arts",
        maxAmount: 150000,
        deadline: "2024-09-30",
        eligibility: ["Arts organizations", "Cultural institutions", "Community groups"],
        status: "upcoming",
        applicants: 0,
        fundingBody: "National Arts Council",
        requirements: [
          "Arts organization registration",
          "Cultural impact statement",
          "Community engagement plan",
          "Artist portfolios",
        ],
      },
      {
        id: "6",
        title: "Technology Innovation Challenge",
        description:
          "Funding breakthrough technology projects in AI, blockchain, IoT, and other emerging technologies with commercial potential.",
        category: "technology",
        maxAmount: 1000000,
        deadline: "2024-04-15",
        eligibility: ["Technology companies", "Research institutions", "Innovation labs"],
        status: "closed",
        applicants: 89,
        fundingBody: "Technology Innovation Fund",
        requirements: [
          "Technology patent",
          "Prototype demonstration",
          "Market analysis",
          "Technical documentation",
          "IP protection plan",
        ],
      },
    ]

    setGrants(availableGrants)
    setFilteredGrants(availableGrants)
  }, [])

  useEffect(() => {
    let filtered = grants

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (grant) =>
          grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          grant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          grant.fundingBody.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((grant) => grant.category === categoryFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((grant) => grant.status === statusFilter)
    }

    setFilteredGrants(filtered)
  }, [grants, searchQuery, categoryFilter, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "default"
      case "closed":
        return "destructive"
      case "upcoming":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Available Grants</CardTitle>
          <CardDescription>Browse and apply for grants that match your organization's needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search grants by title, description, or funding body..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="arts">Arts & Culture</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grant Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGrants.map((grant) => {
          const daysLeft = getDaysUntilDeadline(grant.deadline)

          return (
            <Card key={grant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{grant.title}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="capitalize">
                        {grant.category}
                      </Badge>
                      <Badge variant={getStatusColor(grant.status)} className="capitalize">
                        {grant.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">${grant.maxAmount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Max Amount</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">{grant.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium">Deadline</div>
                      <div className="text-gray-600">{new Date(grant.deadline).toLocaleDateString()}</div>
                      {grant.status === "open" && (
                        <div className={`text-xs ${daysLeft <= 7 ? "text-red-600" : "text-orange-600"}`}>
                          {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium">Applicants</div>
                      <div className="text-gray-600">{grant.applicants}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-medium text-sm mb-2">Funding Body</div>
                  <div className="text-sm text-gray-600">{grant.fundingBody}</div>
                </div>

                <div>
                  <div className="font-medium text-sm mb-2">Eligibility Requirements</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {grant.eligibility.slice(0, 2).map((req, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                    {grant.eligibility.length > 2 && (
                      <li className="text-blue-600 text-xs">+{grant.eligibility.length - 2} more requirements</li>
                    )}
                  </ul>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button onClick={() => onApply(grant.id)} disabled={grant.status !== "open"} className="flex-1">
                    {grant.status === "open" ? "Apply Now" : grant.status === "upcoming" ? "Coming Soon" : "Closed"}
                  </Button>
                  <Button variant="outline">View Details</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredGrants.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Filter className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No grants found</h3>
              <p>Try adjusting your search criteria or filters to find relevant grants.</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setCategoryFilter("all")
                setStatusFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
