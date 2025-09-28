import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { projectId, userAgent } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get client IP address for duplicate prevention
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"

    // Check if this IP has already voted for this project
    const { data: existingVote, error: checkError } = await supabase
      .from("votes")
      .select("id")
      .eq("project_id", projectId)
      .eq("voter_ip", ip)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" which is expected for new votes
      console.error("Error checking existing vote:", checkError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (existingVote) {
      return NextResponse.json({ error: "You have already voted for this project" }, { status: 409 })
    }

    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Insert the vote
    const { error: insertError } = await supabase.from("votes").insert({
      project_id: projectId,
      voter_ip: ip,
      user_agent: userAgent || null,
    })

    if (insertError) {
      console.error("Error inserting vote:", insertError)
      return NextResponse.json({ error: "Failed to record vote" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Vote recorded successfully" })
  } catch (error) {
    console.error("Error in vote API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
