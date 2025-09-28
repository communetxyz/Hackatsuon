"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart, Users, TrendingUp, Mail, RefreshCw, Trophy } from "lucide-react"

interface Project {
  id: string
  title: string
  team_name: string
  category: string
  vote_count: number
}

interface ResultsData {
  totalVotes: number
  totalEmails: number
  recentVotes: number
  projects: Project[]
  categoryVotes: Record<string, number>
}

export default function ResultsPage() {
  const [data, setData] = useState<ResultsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchResults = async () => {
    try {
      const response = await fetch("/api/results", { cache: "no-store" })
      if (response.ok) {
        const newData = await response.json()
        setData(newData)
        setLastUpdated(new Date())
      } else {
        console.error("Failed to fetch results")
      }
    } catch (error) {
      console.error("Error fetching results:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchResults()
  }

  useEffect(() => {
    fetchResults()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchResults, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background grid-pattern">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background grid-pattern">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load results. Please try again.</p>
            <Button onClick={fetchResults} className="mt-4">
              Retry
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const sortedProjects = [...data.projects].sort((a, b) => b.vote_count - a.vote_count)
  const topProject = sortedProjects[0]
  const maxVotes = Math.max(...data.projects.map((p) => p.vote_count), 1)

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
    <div className="min-h-screen bg-background grid-pattern">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Voting
            <span className="block text-primary">Results</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Real-time voting results and community engagement metrics for Kesennuma Hackathon 2025.
          </p>
        </div>

        <div className="space-y-8">
          {/* Header with refresh */}
          <div className="flex items-center justify-between">
            <div>
              {lastUpdated && (
                <p className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</p>
              )}
            </div>
            <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="sm">
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
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Currently Leading
                </CardTitle>
                <CardDescription>The project with the most community votes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{topProject.title}</h3>
                    <p className="text-sm text-muted-foreground">by {topProject.team_name}</p>
                    <Badge className={`${getCategoryColor(topProject.category)} border mt-2`}>
                      {topProject.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{topProject.vote_count}</div>
                    <p className="text-sm text-muted-foreground">votes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
      </main>
      <Footer />
    </div>
  )
}
