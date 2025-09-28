// Email utility functions for coupon distribution
export interface CouponEmail {
  id: string
  email: string
  name?: string
  created_at: string
}

export function generateCouponCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "KESENNUMA"
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function formatEmailForCoupon(email: CouponEmail): string {
  const couponCode = generateCouponCode()
  const name = email.name || "Valued Participant"

  return `
Dear ${name},

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
}

export function exportEmailsToCSV(emails: CouponEmail[]): string {
  const headers = ["Email", "Name", "Registration Date", "Coupon Code"]
  const rows = emails.map((email) => [
    email.email,
    email.name || "",
    new Date(email.created_at).toLocaleDateString(),
    generateCouponCode(),
  ])

  return [headers, ...rows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")
}
