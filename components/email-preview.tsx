"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateCouponCode } from "@/lib/email-utils"

interface EmailPreviewProps {
  recipientName?: string
  recipientEmail?: string
}

export function EmailPreview({
  recipientName = "Valued Participant",
  recipientEmail = "example@email.com",
}: EmailPreviewProps) {
  const { toast } = useToast()
  const couponCode = generateCouponCode()

  const emailContent = `
Dear ${recipientName},

Thank you for participating in the Kesennuma Hackatsuon 2025 voting!

Your exclusive coupon code: ${couponCode}

This code can be used at participating local businesses in Kesennuma for a special discount. Present this code at checkout to receive your reward.

Participating businesses:
- Local restaurants and cafes
- Traditional craft shops  
- Tourism and experience providers
- Selected retail stores

Valid until: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

Thank you for supporting innovation in Kesennuma!

Best regards,
Kesennuma Hackatsuon 2025 Team
  `.trim()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailContent)
    toast({
      title: "Copied!",
      description: "Email template copied to clipboard.",
    })
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Template Preview
            </CardTitle>
            <CardDescription>Sample coupon email for {recipientEmail}</CardDescription>
          </div>
          <Button onClick={copyToClipboard} variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Coupon Code</Badge>
            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{couponCode}</code>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">{emailContent}</pre>
          </div>

          <div className="text-xs text-muted-foreground">
            This template can be customized for bulk email distribution to all registered participants.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
