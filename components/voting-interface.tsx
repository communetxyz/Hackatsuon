"use client"

import type React from "react"

import { useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Copy, Check } from "lucide-react"

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
  const [showCouponForm, setShowCouponForm] = useState(false)
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)
  const [couponCode] = useState("KESENNUMA2025") // hardcoded coupon code
  const [copiedCoupon, setCopiedCoupon] = useState(false)
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
          title: "🎉 Vote submitted successfully!",
          description: "Your coupon code is ready! Check below for your discount.",
          className: "bg-green-50 border-green-200 text-green-800",
        })

        if (typeof window !== "undefined") {
          // Simple confetti effect using CSS animations
          const confetti = document.createElement("div")
          confetti.innerHTML = "🎉🎊✨🌟💫"
          confetti.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 2rem;
            z-index: 1000;
            animation: confetti-fall 2s ease-out forwards;
            pointer-events: none;
          `
          document.body.appendChild(confetti)
          setTimeout(() => document.body.removeChild(confetti), 2000)
        }

        setShowCouponForm(true)
      } else {
        toast({
          title: "Vote failed",
          description: result.error || "There was an issue submitting your vote.",
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
          title: "Email saved!",
          description: "Your email has been saved for future updates.",
        })
        setEmail("")
        setName("")
      } else {
        toast({
          title: "Save failed",
          description: result.error || "This email may already be registered.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting email:", error)
      toast({
        title: "Error",
        description: "Failed to save email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingEmail(false)
    }
  }

  const copyCouponCode = async () => {
    try {
      await navigator.clipboard.writeText(couponCode)
      setCopiedCoupon(true)
      toast({
        title: "Copied!",
        description: "Coupon code copied to clipboard",
      })
      setTimeout(() => setCopiedCoupon(false), 2000)
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please manually copy the coupon code",
        variant: "destructive",
      })
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

      {showCouponForm && (
        <Card className="max-w-md mx-auto bg-gradient-to-br from-green-50 to-blue-50 border-green-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-green-800">🎉 Here's Your Coupon Code!</CardTitle>
            <CardDescription className="text-green-700">
              Your exclusive discount for local Kesennuma businesses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Coupon Code Display */}
            <div className="bg-white rounded-lg p-6 border-2 border-dashed border-green-300 text-center">
              <div className="text-sm text-gray-600 mb-2">Your Coupon Code</div>
              <div className="text-3xl font-bold text-green-800 mb-4 tracking-wider">{couponCode}</div>
              <Button
                onClick={copyCouponCode}
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
              >
                {copiedCoupon ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copiedCoupon ? "Copied!" : "Copy Code"}
              </Button>
            </div>

            {/* Usage Instructions */}
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-medium">How to use:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Present this code at participating local businesses</li>
                <li>Valid for restaurants, cafes, craft shops, and tourism providers</li>
                <li>Valid until: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</li>
              </ul>
            </div>

            {/* Optional Email Collection */}
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-3">Want updates about future events? (Optional)</p>
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com (optional)"
                    className="text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmittingEmail} size="sm" className="flex-1">
                    {isSubmittingEmail ? "Saving..." : "Save Email"}
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowCouponForm(false)}>
                    Close
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
