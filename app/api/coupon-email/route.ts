import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const supabase = await createClient()

    try {
      // Check if email already exists
      const { data: existingEmail, error: checkError } = await supabase
        .from("coupon_emails")
        .select("id")
        .eq("email", email.toLowerCase())
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is "not found" which is expected for new emails
        // Check if it's a table not found error
        if (checkError.message?.includes("Could not find the table")) {
          return NextResponse.json(
            {
              error: "Database not initialized. Please run the setup script first.",
            },
            { status: 503 },
          )
        }
        console.error("Error checking existing email:", checkError)
        return NextResponse.json({ error: "Database error" }, { status: 500 })
      }

      if (existingEmail) {
        return NextResponse.json({ error: "This email is already registered" }, { status: 409 })
      }

      // Insert the email
      const { error: insertError } = await supabase.from("coupon_emails").insert({
        email: email.toLowerCase(),
        name: name || null,
      })

      if (insertError) {
        console.error("Error inserting email:", insertError)
        return NextResponse.json({ error: "Failed to register email" }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "Email registered successfully" })
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
    console.error("Error in coupon-email API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
