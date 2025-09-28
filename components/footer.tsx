export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Kesennuma Hackatsuon 2025</h3>
            <p className="text-sm text-muted-foreground">
              Empowering innovation to address regional challenges through AI and Web3 technologies.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3">Event Info</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Location: Kesennuma, Japan</li>
              <li>Date: March 2025</li>
              <li>Focus: AI & Web3 Solutions</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Contact</h4>
            <p className="text-sm text-muted-foreground">
              For questions about the hackathon or voting platform, please contact the organizers.
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Kesennuma Hackatsuon. Built with innovation in mind.</p>
        </div>
      </div>
    </footer>
  )
}
