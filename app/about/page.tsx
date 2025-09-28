import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            About
            <span className="block text-primary">Kesennuma Hackatsuon</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            A civic tech hackathon focused on AI and Web3 solutions for regional challenges in Kesennuma, Japan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>The Challenge</CardTitle>
              <CardDescription>Addressing regional issues through innovation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Kesennuma faces significant challenges common to many regional Japanese cities: an aging population,
                economic stagnation, and declining local industries. This hackathon brings together innovators to
                develop AI and Web3 solutions that can revitalize the community.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Aging Population</Badge>
                <Badge variant="outline">Economic Revitalization</Badge>
                <Badge variant="outline">Local Industry Support</Badge>
                <Badge variant="outline">Community Connection</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>Technology for community impact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We believe technology should serve communities. This hackathon showcases how AI and Web3 can create
                practical solutions that improve daily life, support local businesses, and strengthen community bonds in
                Kesennuma.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border">AI Solutions</Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 border">Web3 Innovation</Badge>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border">IoT Integration</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm mb-12">
          <CardHeader>
            <CardTitle>How Voting Works</CardTitle>
            <CardDescription>Community-driven project selection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Browse Projects</h3>
                <p className="text-sm text-muted-foreground">
                  Explore innovative solutions created by teams addressing Kesennuma's challenges.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Vote for Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Cast your vote for projects that you believe will make the biggest difference.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Get Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Receive coupon codes for local Kesennuma businesses as a thank you for participating.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Join us in Kesennuma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">When & Where</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <strong>Date:</strong> March 2025
                  </li>
                  <li>
                    <strong>Location:</strong> Kesennuma, Miyagi Prefecture, Japan
                  </li>
                  <li>
                    <strong>Duration:</strong> 48-hour hackathon
                  </li>
                  <li>
                    <strong>Voting Period:</strong> Open to public during and after event
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Focus Areas</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <strong>AI:</strong> Machine learning solutions for local challenges
                  </li>
                  <li>
                    <strong>Web3:</strong> Blockchain and decentralized applications
                  </li>
                  <li>
                    <strong>IoT:</strong> Connected devices for smart city initiatives
                  </li>
                  <li>
                    <strong>Other:</strong> Creative tech solutions beyond traditional categories
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
