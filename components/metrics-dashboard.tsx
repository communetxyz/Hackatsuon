"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Heart, Users, TrendingUp, Mail, RefreshCw } from "lucide-react"

interface Project {
  id: string
  title: string
  team_name: string
  category: string
  vote_count: number
}

interface MetricsData {
  totalVotes: number
  totalEmails: number
  recentVotes: number
  projects: Project[]
  categoryVotes: Record<string, number>
}

interface MetricsDashboardProps {
  data: MetricsData
}

export function MetricsDashboard({ data: initialData }: MetricsDashboardProps) {
  const [data, setData] = useState(initialData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/metrics", { cache: "no-store" })
      if (response.ok) {
        const newData = await response.json()
        setData(newData)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [])

  const sortedProjects = [...data.projects].sort((a, b) => b.vote_count - a.vote_count)
  const topProject = sortedProjects[0]
  const maxVotes = Math.max(...data.projects.map((p) => p.vote_count), 1)

  // Prepare chart data
  const categoryChartData = Object.entries(data.categoryVotes).map(([category, votes]) => ({
    category,
    votes,
  }))

  const projectChartData = sortedProjects.slice(0, 6).map((project) => ({
    name: project.title.length > 20 ? project.title.substring(0, 20) + "..." : project.title,
    votes: project.vote_count,
    team: project.team_name,
  }))

  const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#6366f1"]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "AI":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Web3":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "IoT":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <Button onClick={refreshData} disabled={isRefreshing} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalVotes}</div>
            <p className="text-xs text-muted-foreground">Community participation</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Signups</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalEmails}</div>
            <p className="text-xs text-muted-foreground">Coupon registrations</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.recentVotes}</div>
            <p className="text-xs text-muted-foreground">Votes in last 24h</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.projects.length}</div>
            <p className="text-xs text-muted-foreground">Competing teams</p>
          </CardContent>
        </Card>
      </div>

      {/* Leading Project */}
      {topProject && (
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🏆</span>
              Currently Leading
            </CardTitle>
            <CardDescription>The project with the most community votes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{topProject.title}</h3>
                <p className="text-sm text-muted-foreground">by {topProject.team_name}</p>
                <Badge className={`${getCategoryColor(topProject.category)} border mt-2`}>{topProject.category}</Badge>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{topProject.vote_count}</div>
                <p className="text-sm text-muted-foreground">votes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Votes Bar Chart */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Project Rankings</CardTitle>
            <CardDescription>Vote distribution across projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="votes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution Pie Chart */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Votes by project category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="votes"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Project List */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>Complete ranking with vote counts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedProjects.map((project, index) => (
              <div key={project.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{project.title}</h4>
                    <p className="text-sm text-muted-foreground">by {project.team_name}</p>
                  </div>
                  <Badge className={`${getCategoryColor(project.category)} border`}>{project.category}</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <Progress value={(project.vote_count / maxVotes) * 100} className="h-2" />
                  </div>
                  <div className="text-right min-w-[60px]">
                    <div className="font-semibold">{project.vote_count}</div>
                    <div className="text-xs text-muted-foreground">votes</div>
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
