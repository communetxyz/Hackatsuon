import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: emails, error } = await supabase
      .from("coupon_emails")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching emails:", error)
      return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 })
    }

    return NextResponse.json({ emails: emails || [] })
  } catch (error) {
    console.error("Error in admin emails API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
