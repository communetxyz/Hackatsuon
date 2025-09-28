import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET - Fetch all projects (admin view)
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: projects, error } = await supabase
      .from("projects")
      .select(`
        *,
        votes(count)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    }

    const projectsWithVotes =
      projects?.map((project) => ({
        ...project,
        vote_count: project.votes?.[0]?.count || 0,
      })) || []

    return NextResponse.json({ projects: projectsWithVotes })
  } catch (error) {
    console.error("Error in admin projects API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new project (admin only)
export async function POST(request: NextRequest) {
  try {
    const { title, description, team_name, category, image_url, demo_url, github_url } = await request.json()

    if (!title || !description || !team_name || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const validCategories = ["AI", "Web3", "IoT", "Other"]
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        title,
        description,
        team_name,
        category,
        image_url: image_url || null,
        demo_url: demo_url || null,
        github_url: github_url || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating project:", error)
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }

    return NextResponse.json({ project, message: "Project created successfully" })
  } catch (error) {
    console.error("Error in admin create project API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
