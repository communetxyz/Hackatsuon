import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    console.log("[v0] Starting metrics API call")

    // Get total vote count
    const { count: totalVotes, error: votesError } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true })

    if (votesError) {
      console.error("[v0] Error fetching vote count:", votesError)
      return NextResponse.json({ error: "Failed to fetch vote metrics" }, { status: 500 })
    }

    console.log("[v0] Total votes:", totalVotes)

    // Get total email registrations
    const { count: totalEmails, error: emailsError } = await supabase
      .from("coupon_emails")
      .select("*", { count: "exact", head: true })

    if (emailsError) {
      console.error("[v0] Error fetching email count:", emailsError)
      return NextResponse.json({ error: "Failed to fetch email metrics" }, { status: 500 })
    }

    console.log("[v0] Total emails:", totalEmails)

    const { data: projects, error: projectError } = await supabase
      .from("projects")
      .select("id, title, team_name, category")
      .order("created_at", { ascending: true })

    if (projectError) {
      console.error("[v0] Error fetching projects:", projectError)
      return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 })
    }

    console.log("[v0] Projects fetched:", projects?.length)

    const projectsWithVotes = []
    for (const project of projects || []) {
      const { count: voteCount, error: voteCountError } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("project_id", project.id)

      if (voteCountError) {
        console.error(`[v0] Error fetching votes for project ${project.id}:`, voteCountError)
        projectsWithVotes.push({ ...project, vote_count: 0 })
      } else {
        projectsWithVotes.push({ ...project, vote_count: voteCount || 0 })
      }
    }

    console.log("[v0] Projects with vote counts:", projectsWithVotes.length)

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
      console.error("[v0] Error fetching recent votes:", recentError)
    }

    console.log("[v0] Recent votes:", recentVotes)

    const result = {
      totalVotes: totalVotes || 0,
      totalEmails: totalEmails || 0,
      recentVotes: recentVotes || 0,
      projects: projectsWithVotes,
      categoryVotes,
    }

    console.log("[v0] Returning metrics result:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error in metrics API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
