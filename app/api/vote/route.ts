import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { projectId, userAgent } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get client IP address for tracking (but not duplicate prevention)
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"

    try {
      // Verify project exists
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("id")
        .eq("id", projectId)
        .single()

      if (projectError) {
        if (projectError.message?.includes("Could not find the table")) {
          return NextResponse.json(
            {
              error: "Database not initialized. Please run the setup script first.",
            },
            { status: 503 },
          )
        }
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }

      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }

      // Insert the vote (IP is recorded but duplicates are allowed)
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
    } catch (dbError: any) {
      if (dbError.message?.includes("Could not find the table")) {
        return NextResponse.json(
          {
            error: "Database not initialized. Please run the setup script first.",
          },
          { status: 503 },
        )
      }
      throw dbError
    }
  } catch (error) {
    console.error("Error in vote API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
