"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Download, Plus, Mail, Users, BarChart3 } from "lucide-react"

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
  created_at: string
}

interface Email {
  id: string
  email: string
  name?: string
  created_at: string
}

interface AdminDashboardProps {
  projects: Project[]
  emails: Email[]
}

export function AdminDashboard({ projects: initialProjects, emails: initialEmails }: AdminDashboardProps) {
  const [projects, setProjects] = useState(initialProjects)
  const [emails, setEmails] = useState(initialEmails)
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    team_name: "",
    category: "",
    image_url: "",
    demo_url: "",
    github_url: "",
  })
  const { toast } = useToast()

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingProject(true)

    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      })

      const result = await response.json()

      if (response.ok) {
        setProjects([{ ...result.project, vote_count: 0 }, ...projects])
        setNewProject({
          title: "",
          description: "",
          team_name: "",
          category: "",
          image_url: "",
          demo_url: "",
          github_url: "",
        })
        toast({
          title: "Project created!",
          description: "New project has been added to the voting platform.",
        })
      } else {
        toast({
          title: "Creation failed",
          description: result.error || "Failed to create project.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingProject(false)
    }
  }

  const exportEmails = () => {
    const csvContent = [
      ["Email", "Name", "Registration Date"],
      ...emails.map((email) => [email.email, email.name || "", new Date(email.created_at).toLocaleDateString()]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `kesennuma-emails-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export complete!",
      description: `Exported ${emails.length} email addresses to CSV.`,
    })
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

  const totalVotes = projects.reduce((sum, project) => sum + project.vote_count, 0)

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">Active hackathon projects</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes}</div>
            <p className="text-xs text-muted-foreground">Community engagement</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Signups</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emails.length}</div>
            <p className="text-xs text-muted-foreground">Coupon registrations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="emails">Email List</TabsTrigger>
          <TabsTrigger value="create">Add Project</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
              <CardDescription>Overview of all hackathon projects and their voting performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{project.title}</h4>
                        <Badge className={`${getCategoryColor(project.category)} border`}>{project.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">by {project.team_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{project.vote_count}</div>
                      <div className="text-xs text-muted-foreground">votes</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Email Management</CardTitle>
                  <CardDescription>Registered emails for coupon distribution</CardDescription>
                </div>
                <Button onClick={exportEmails} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emails.map((email) => (
                  <div key={email.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <div className="font-medium">{email.email}</div>
                      {email.name && <div className="text-sm text-muted-foreground">{email.name}</div>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(email.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {emails.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No email registrations yet.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Add New Project</CardTitle>
              <CardDescription>Create a new hackathon project for voting</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="Enter project title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="team_name">Team Name</Label>
                    <Input
                      id="team_name"
                      value={newProject.team_name}
                      onChange={(e) => setNewProject({ ...newProject, team_name: e.target.value })}
                      placeholder="Enter team name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newProject.category}
                    onValueChange={(value) => setNewProject({ ...newProject, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AI">AI</SelectItem>
                      <SelectItem value="Web3">Web3</SelectItem>
                      <SelectItem value="IoT">IoT</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Describe the project and its impact"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="image_url">Image URL (Optional)</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={newProject.image_url}
                      onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="demo_url">Demo URL (Optional)</Label>
                    <Input
                      id="demo_url"
                      type="url"
                      value={newProject.demo_url}
                      onChange={(e) => setNewProject({ ...newProject, demo_url: e.target.value })}
                      placeholder="https://demo.example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github_url">GitHub URL (Optional)</Label>
                    <Input
                      id="github_url"
                      type="url"
                      value={newProject.github_url}
                      onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                      placeholder="https://github.com/team/project"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isCreatingProject} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  {isCreatingProject ? "Creating..." : "Create Project"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
