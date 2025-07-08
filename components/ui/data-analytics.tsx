"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Users, FileText, Clock } from "lucide-react"

interface AnalyticsData {
  totalApplications: number
  approvedApplications: number
  rejectedApplications: number
  pendingApplications: number
  totalFunding: number
  averageProcessingTime: number
  topCategories: Array<{ category: string; count: number; percentage: number }>
  monthlyTrends: Array<{ month: string; applications: number; funding: number }>
}

interface DataAnalyticsProps {
  data: AnalyticsData
}

export function DataAnalytics({ data }: DataAnalyticsProps) {
  const approvalRate =
    data.totalApplications > 0 ? ((data.approvedApplications / data.totalApplications) * 100).toFixed(1) : "0"

  const rejectionRate =
    data.totalApplications > 0 ? ((data.rejectedApplications / data.totalApplications) * 100).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalApplications}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Badge variant="outline">{approvalRate}% approved</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalFunding.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>Approved funding</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageProcessingTime} days</div>
            <div className="text-xs text-muted-foreground">From submission to decision</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.pendingApplications}</div>
            <div className="text-xs text-muted-foreground">Awaiting decision</div>
          </CardContent>
        </Card>
      </div>

      {/* Approval/Rejection Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
            <CardDescription>Breakdown of application outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Approved</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{data.approvedApplications}</div>
                  <div className="text-xs text-muted-foreground">{approvalRate}%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Rejected</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{data.rejectedApplications}</div>
                  <div className="text-xs text-muted-foreground">{rejectionRate}%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{data.pendingApplications}</div>
                  <div className="text-xs text-muted-foreground">
                    {data.totalApplications > 0
                      ? ((data.pendingApplications / data.totalApplications) * 100).toFixed(1)
                      : "0"}
                    %
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Grant Categories</CardTitle>
            <CardDescription>Most popular application categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topCategories.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <span className="text-sm capitalize">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{category.count}</div>
                    <div className="text-xs text-muted-foreground">{category.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Application and funding trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.monthlyTrends.map((trend) => (
              <div key={trend.month} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="font-medium">{trend.month}</div>
                <div className="flex space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{trend.applications}</div>
                    <div className="text-xs text-muted-foreground">Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">${trend.funding.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Funding</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
