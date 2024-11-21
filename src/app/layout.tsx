'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/')
    }
  }, [router])

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
