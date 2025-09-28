import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MetricsDashboard } from "@/components/metrics-dashboard"

export default async function MetricsPage() {
  const supabase = await createClient()

  // Fetch metrics data
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/metrics`, {
    cache: "no-store",
  })

  let metricsData = null
  if (response.ok) {
    metricsData = await response.json()
  }

  // Fallback: fetch directly from database if API fails
  if (!metricsData) {
    try {
      // Get total vote count
      const { count: totalVotes } = await supabase.from("votes").select("*", { count: "exact", head: true })

      // Get total email registrations
      const { count: totalEmails } = await supabase.from("coupon_emails").select("*", { count: "exact", head: true })

      // Get projects first
      const { data: projects } = await supabase
        .from("projects")
        .select("id, title, team_name, category")
        .order("created_at", { ascending: true })

      // Get vote counts for each project individually
      const projectsWithVotes = []
      for (const project of projects || []) {
        const { count: voteCount } = await supabase
          .from("votes")
          .select("*", { count: "exact", head: true })
          .eq("project_id", project.id)

        projectsWithVotes.push({
          ...project,
          vote_count: voteCount || 0,
        })
      }

      const categoryVotes = projectsWithVotes.reduce(
        (acc, project) => {
          acc[project.category] = (acc[project.category] || 0) + project.vote_count
          return acc
        },
        {} as Record<string, number>,
      )

      // Get recent voting activity (last 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { count: recentVotes } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .gte("created_at", twentyFourHoursAgo)

      metricsData = {
        totalVotes: totalVotes || 0,
        totalEmails: totalEmails || 0,
        recentVotes: recentVotes || 0,
        projects: projectsWithVotes,
        categoryVotes,
      }
    } catch (error) {
      console.error("Error fetching metrics:", error)
      metricsData = {
        totalVotes: 0,
        totalEmails: 0,
        recentVotes: 0,
        projects: [],
        categoryVotes: {},
      }
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
            Real-time voting results and community engagement metrics for Kesennuma Hackatsuon 2025.
          </p>
        </div>

        <MetricsDashboard data={metricsData} />
      </main>
      <Footer />
    </div>
  )
}
