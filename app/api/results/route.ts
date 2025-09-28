import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total vote count
    const { count: totalVotes } = await supabase.from("votes").select("*", { count: "exact", head: true })

    // Get total email registrations
    const { count: totalEmails } = await supabase.from("coupon_emails").select("*", { count: "exact", head: true })

    // Get projects
    const { data: projects } = await supabase
      .from("projects")
      .select("id, title, team_name, category")
      .order("created_at", { ascending: true })

    // Get vote counts for each project
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

    // Calculate category votes
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

    return NextResponse.json({
      totalVotes: totalVotes || 0,
      totalEmails: totalEmails || 0,
      recentVotes: recentVotes || 0,
      projects: projectsWithVotes,
      categoryVotes,
    })
  } catch (error) {
    console.error("Error in results API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
