import { createClient } from "@/lib/supabase/server"
import { VotingInterface } from "@/components/voting-interface"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default async function HomePage() {
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
    return <div>Error loading projects</div>
  }

  // Transform data to include vote counts
  const projectsWithVotes =
    projects?.map((project) => ({
      ...project,
      vote_count: project.votes?.[0]?.count || 0,
    })) || []

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

        <VotingInterface projects={projectsWithVotes} />
      </main>
      <Footer />
    </div>
  )
}
