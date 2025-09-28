import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch projects with vote counts
    const { data: projects, error } = await supabase
      .from("projects")
      .select(`
        *,
        votes(count)
      `)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching projects:", error)
      return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    }

    // Transform data to include vote counts
    const projectsWithVotes =
      projects?.map((project) => ({
        ...project,
        vote_count: project.votes?.[0]?.count || 0,
      })) || []

    return NextResponse.json({ projects: projectsWithVotes })
  } catch (error) {
    console.error("Error in projects API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
