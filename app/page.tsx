import { createClient } from "@/lib/supabase/server"
import { VotingInterface } from "@/components/voting-interface"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default async function HomePage() {
  const supabase = await createClient()

  let projects = []
  let databaseError = false

  try {
    // First fetch all projects
    const { data: projectsData, error: projectsError } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: true })

    if (projectsError) {
      console.error("Error fetching projects:", projectsError.message)
      if (projectsError.message.includes("Could not find the table")) {
        databaseError = true
      } else {
        throw projectsError
      }
    } else if (projectsData) {
      // Then fetch vote counts for each project separately
      const projectsWithVotes = await Promise.all(
        projectsData.map(async (project) => {
          const { count, error: voteError } = await supabase
            .from("votes")
            .select("*", { count: "exact", head: true })
            .eq("project_id", project.id)

          if (voteError) {
            console.error(`Error fetching votes for project ${project.id}:`, voteError)
            return { ...project, vote_count: 0 }
          }

          return { ...project, vote_count: count || 0 }
        }),
      )

      projects = projectsWithVotes
    }
  } catch (error) {
    console.error("Database error:", error)
    databaseError = true
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Kesennuma Hackatsuon
            <span className="block text-primary">2025</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Vote for the most innovative AI and Web3 solutions addressing regional challenges. Help shape the future of
            Kesennuma through technology and community collaboration.
          </p>
        </div>

        {databaseError ? (
          <div className="max-w-2xl mx-auto">
            <Alert className="mb-8">
              <AlertDescription className="text-center">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Database Setup Required</h3>
                  <p className="text-muted-foreground mb-4">
                    The voting platform database needs to be initialized. Please run the setup script to create the
                    required tables.
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg text-left">
                  <p className="font-mono text-sm mb-2">Run this script in your Supabase project:</p>
                  <code className="text-xs bg-background p-2 rounded block">scripts/001_create_tables.sql</code>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <VotingInterface projects={projects} />
        )}
      </main>
      <Footer />
    </div>
  )
}
