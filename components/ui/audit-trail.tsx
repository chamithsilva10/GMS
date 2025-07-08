"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search, Filter, Eye, User, FileText, Settings, Shield } from "lucide-react"

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  userRole: string
  action: string
  resource: string
  resourceId: string
  details: string
  ipAddress: string
  userAgent: string
  status: "success" | "failed" | "warning"
}

interface AuditTrailProps {
  logs: AuditLog[]
  onExport: () => void
}

export function AuditTrail({ logs, onExport }: AuditTrailProps) {
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>(logs)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  useEffect(() => {
    let filtered = logs

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.details.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Action filter
    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.action.toLowerCase().includes(actionFilter))
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((log) => log.status === statusFilter)
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
      }

      if (dateFilter !== "all") {
        filtered = filtered.filter((log) => new Date(log.timestamp) >= filterDate)
      }
    }

    setFilteredLogs(filtered)
  }, [logs, searchQuery, actionFilter, statusFilter, dateFilter])

  const getActionIcon = (action: string) => {
    if (action.includes("login") || action.includes("logout")) return <User className="w-4 h-4" />
    if (action.includes("create") || action.includes("submit")) return <FileText className="w-4 h-4" />
    if (action.includes("view") || action.includes("access")) return <Eye className="w-4 h-4" />
    if (action.includes("update") || action.includes("modify")) return <Settings className="w-4 h-4" />
    if (action.includes("security") || action.includes("permission")) return <Shield className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "default"
      case "failed":
        return "destructive"
      case "warning":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRiskLevel = (log: AuditLog) => {
    if (log.status === "failed" && (log.action.includes("login") || log.action.includes("security"))) {
      return "high"
    }
    if (log.action.includes("delete") || log.action.includes("admin")) {
      return "medium"
    }
    return "low"
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Complete log of all system activities and user actions</CardDescription>
            </div>
            <Button onClick={onExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="login">Login/Logout</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="admin">Admin Actions</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs ({filteredLogs.length})</CardTitle>
          <CardDescription>Detailed record of all system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const riskLevel = getRiskLevel(log)

                  return (
                    <TableRow key={log.id} className={riskLevel === "high" ? "bg-red-50" : ""}>
                      <TableCell className="font-mono text-sm">{new Date(log.timestamp).toLocaleString()}</TableCell>

                      <TableCell>
                        <div>
                          <div className="font-medium">{log.userName}</div>
                          <div className="text-sm text-gray-500">
                            <Badge variant="outline" className="text-xs">
                              {log.userRole}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getActionIcon(log.action)}
                          <span className="font-medium">{log.action}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <div className="font-medium">{log.resource}</div>
                          {log.resourceId && (
                            <div className="text-sm text-gray-500 font-mono">ID: {log.resourceId}</div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant={getStatusColor(log.status)} className="capitalize">
                          {log.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            riskLevel === "high" ? "destructive" : riskLevel === "medium" ? "secondary" : "outline"
                          }
                          className="capitalize"
                        >
                          {riskLevel}
                        </Badge>
                      </TableCell>

                      <TableCell className="max-w-xs">
                        <div className="truncate" title={log.details}>
                          {log.details}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">IP: {log.ipAddress}</div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
