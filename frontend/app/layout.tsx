import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FoodWagen App',
  description: 'Created with VSCode',
  generator: 'FoodWagen.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
