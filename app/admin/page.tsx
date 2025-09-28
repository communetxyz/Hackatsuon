import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Header } from "@/components/header"

export default async function AdminPage() {
  const supabase = await createClient()

  // Fetch projects with vote counts
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select(`
      *,
      votes(count)
    `)
    .order("created_at", { ascending: false })

  // Fetch email registrations
  const { data: emails, error: emailsError } = await supabase
    .from("coupon_emails")
    .select("*")
    .order("created_at", { ascending: false })

  const projectsWithVotes =
    projects?.map((project) => ({
      ...project,
      vote_count: project.votes?.[0]?.count || 0,
    })) || []

  if (projectsError || emailsError) {
    console.error("Error fetching admin data:", { projectsError, emailsError })
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Admin
            <span className="block text-primary">Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Manage projects, monitor voting activity, and export email lists for coupon distribution.
          </p>
        </div>

        <AdminDashboard projects={projectsWithVotes} emails={emails || []} />
      </main>
    </div>
  )
}
