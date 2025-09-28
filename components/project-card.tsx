"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Heart, Check } from "lucide-react"
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
  const [justVoted, setJustVoted] = useState(false)

  const handleVote = async () => {
    setIsVoting(true)
    await onVote(project.id)
    setIsVoting(false)
    setJustVoted(true)
    setTimeout(() => setJustVoted(false), 3000) // Reset after 3 seconds
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
    <Card
      className={`group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 ${
        justVoted ? "ring-2 ring-green-500/50 shadow-lg shadow-green-500/20 animate-pulse" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Badge className={`${getCategoryColor(project.category)} border`}>{project.category}</Badge>
          <div
            className={`flex items-center gap-1 text-sm transition-colors duration-300 ${
              justVoted ? "text-green-400" : "text-muted-foreground"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-all duration-300 ${
                justVoted ? "fill-green-400 text-green-400 scale-110" : ""
              }`}
            />
            <span className={justVoted ? "font-semibold" : ""}>{project.vote_count}</span>
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
            {justVoted && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-fade-in">
                <div className="bg-green-500 rounded-full p-3 animate-bounce">
                  <Check className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
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

        <Button
          onClick={handleVote}
          disabled={isVoting}
          className={`w-full transition-all duration-300 ${
            justVoted ? "bg-green-600 hover:bg-green-700 text-white" : ""
          }`}
          size="sm"
        >
          {isVoting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Getting your coupon...
            </>
          ) : justVoted ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Coupon Ready!
            </>
          ) : (
            "Vote & Get Coupon Code"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
