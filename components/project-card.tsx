"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Heart } from "lucide-react"
import Image from "next/image"

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

interface ProjectCardProps {
  project: Project
  onVote: (projectId: string) => void
}

export function ProjectCard({ project, onVote }: ProjectCardProps) {
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async () => {
    setIsVoting(true)
    await onVote(project.id)
    setIsVoting(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "AI":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Web3":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "IoT":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    }
  }

  return (
    <Card className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Badge className={`${getCategoryColor(project.category)} border`}>{project.category}</Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Heart className="w-4 h-4" />
            <span>{project.vote_count}</span>
          </div>
        </div>

        {project.image_url && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
            <Image
              src={project.image_url || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div>
          <CardTitle className="text-lg text-balance">{project.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">by {project.team_name}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.demo_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Demo
              </a>
            </Button>
          )}
          {project.github_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-1" />
                Code
              </a>
            </Button>
          )}
        </div>

        <Button onClick={handleVote} disabled={isVoting} className="w-full" size="sm">
          {isVoting ? "Voting..." : "Vote for this project"}
        </Button>
      </CardContent>
    </Card>
  )
}
