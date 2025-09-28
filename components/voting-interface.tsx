"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  title: string
  description: string
  team_name: string
  category: string
  image_url?: string
  demo_url?: string
  github_url?: string
  vote_count: number
}

interface VotingInterfaceProps {
  projects: Project[]
}

export function VotingInterface({ projects: initialProjects }: VotingInterfaceProps) {
  const [projects, setProjects] = useState(initialProjects)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = ["all", "AI", "Web3", "IoT", "Other"]

  const filteredProjects =
    selectedCategory === "all" ? projects : projects.filter((p) => p.category === selectedCategory)

  const totalVotes = projects.reduce((sum, project) => sum + project.vote_count, 0)

  const handleVote = (projectId: string) => {
    // Update local state when vote succeeds
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, vote_count: p.vote_count + 1 } : p)))
  }

  return (
    <div className="space-y-8">
      {/* Voting Stats */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Voting Progress</span>
            <Badge variant="secondary">{totalVotes} total votes</Badge>
          </CardTitle>
          <CardDescription>Community participation in selecting innovative solutions</CardDescription>
        </CardHeader>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category === "all" ? "All Projects" : category}
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} onVote={handleVote} />
        ))}
      </div>
    </div>
  )
}
