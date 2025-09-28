"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VoteModalProps {
  isOpen: boolean
  onClose: () => void
  projectTitle: string
  projectId: string
  onVoteSuccess: () => void
}

export function VoteModal({ isOpen, onClose, projectTitle, projectId, onVoteSuccess }: VoteModalProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isVoting, setIsVoting] = useState(false)
  const [showCoupon, setShowCoupon] = useState(false)
  const [couponCode] = useState("KESENNUMA2025")
  const [copiedCoupon, setCopiedCoupon] = useState(false)
  const { toast } = useToast()

  const handleVote = async () => {
    setIsVoting(true)

    try {
      // Submit vote
      const userAgent = navigator.userAgent
      const voteResponse = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          userAgent,
        }),
      })

      const voteResult = await voteResponse.json()

      if (voteResponse.ok) {
        // Save email if provided
        if (email.trim()) {
          try {
            await fetch("/api/coupon-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: email.trim(), name: name.trim() }),
            })
          } catch (error) {
            console.log("Email save failed, but vote succeeded")
          }
        }

        // Show confetti effect
        if (typeof window !== "undefined") {
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

        onVoteSuccess()
        setShowCoupon(true)

        toast({
          title: "🎉 Vote submitted successfully!",
          description: "Your coupon code is ready!",
          className: "bg-green-50 border-green-200 text-green-800",
        })
      } else {
        toast({
          title: "Vote failed",
          description: voteResult.error || "There was an issue submitting your vote.",
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
    } finally {
      setIsVoting(false)
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

  const handleClose = () => {
    setEmail("")
    setName("")
    setShowCoupon(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!showCoupon ? (
          <>
            <DialogHeader>
              <DialogTitle>Vote for {projectTitle}</DialogTitle>
              <DialogDescription>
                Fill in your email to get a coupon code after voting! (Email is optional)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleVote} disabled={isVoting} className="flex-1">
                  {isVoting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Voting...
                    </>
                  ) : (
                    "Vote & Get Coupon"
                  )}
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-green-800">🎉 Here's Your Coupon Code!</DialogTitle>
              <DialogDescription className="text-green-700">
                Your exclusive discount for local Kesennuma businesses
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Coupon Code Display */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border-2 border-dashed border-green-300 text-center">
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

              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
