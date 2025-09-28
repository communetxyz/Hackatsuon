import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total vote count
    const { count: totalVotes, error: votesError } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true })

    if (votesError) {
      console.error("Error fetching vote count:", votesError)
      return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
    }

    // Get total email registrations
    const { count: totalEmails, error: emailsError } = await supabase
      .from("coupon_emails")
      .select("*", { count: "exact", head: true })

    if (emailsError) {
      console.error("Error fetching email count:", emailsError)
      return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
    }

    // Get project vote counts
    const { data: projectVotes, error: projectError } = await supabase
      .from("projects")
      .select(`
        id,
        title,
        team_name,
        category,
        votes(count)
      `)
      .order("created_at", { ascending: true })

    if (projectError) {
      console.error("Error fetching project votes:", projectError)
      return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
    }

    // Transform project data
    const projectsWithVotes =
      projectVotes?.map((project) => ({
        ...project,
        vote_count: project.votes?.[0]?.count || 0,
      })) || []

    // Get votes by category
    const categoryVotes = projectsWithVotes.reduce(
      (acc, project) => {
        acc[project.category] = (acc[project.category] || 0) + project.vote_count
        return acc
      },
      {} as Record<string, number>,
    )

    // Get recent voting activity (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count: recentVotes, error: recentError } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true })
      .gte("created_at", twentyFourHoursAgo)

    if (recentError) {
      console.error("Error fetching recent votes:", recentError)
    }

    return NextResponse.json({
      totalVotes: totalVotes || 0,
      totalEmails: totalEmails || 0,
      recentVotes: recentVotes || 0,
      projects: projectsWithVotes,
      categoryVotes,
    })
  } catch (error) {
    console.error("Error in metrics API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
