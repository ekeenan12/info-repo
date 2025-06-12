import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Info Repository',
  description: 'Personal information repository for documents, videos, and websites',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
