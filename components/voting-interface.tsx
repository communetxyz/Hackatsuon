"use client"

import type React from "react"

import { useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

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
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)
  const { toast } = useToast()

  const categories = ["all", "AI", "Web3", "IoT", "Other"]

  const filteredProjects =
    selectedCategory === "all" ? projects : projects.filter((p) => p.category === selectedCategory)

  const totalVotes = projects.reduce((sum, project) => sum + project.vote_count, 0)

  const handleVote = async (projectId: string) => {
    const supabase = createClient()

    try {
      // Get user's IP and user agent for duplicate prevention
      const userAgent = navigator.userAgent
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          userAgent,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Update local state
        setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, vote_count: p.vote_count + 1 } : p)))

        toast({
          title: "Vote submitted!",
          description: "Thank you for participating in Kesennuma Hackatsuon 2025.",
        })

        // Show email form after successful vote
        setShowEmailForm(true)
      } else {
        toast({
          title: "Vote failed",
          description: result.error || "You may have already voted for this project.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error voting:", error)
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingEmail(true)

    try {
      const response = await fetch("/api/coupon-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Email registered!",
          description: "You'll receive your coupon code soon.",
        })
        setEmail("")
        setName("")
        setShowEmailForm(false)
      } else {
        toast({
          title: "Registration failed",
          description: result.error || "This email may already be registered.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting email:", error)
      toast({
        title: "Error",
        description: "Failed to register email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingEmail(false)
    }
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

      {/* Email Collection Form */}
      {showEmailForm && (
        <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Get Your Coupon Code</CardTitle>
            <CardDescription>
              Enter your email to receive a special discount coupon for local Kesennuma businesses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmittingEmail} className="flex-1">
                  {isSubmittingEmail ? "Submitting..." : "Get Coupon"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowEmailForm(false)}>
                  Skip
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
