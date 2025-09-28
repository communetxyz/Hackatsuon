import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">K</span>
            </div>
            <span className="font-semibold text-lg">Kesennuma Hackatsuon</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Vote
            </Link>
            <Link href="/metrics" className="text-muted-foreground hover:text-primary transition-colors">
              Results
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/metrics">View Results</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
