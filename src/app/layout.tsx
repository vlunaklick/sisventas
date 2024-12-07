'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './globals.css'
import { AuthProvider } from '@/components/AuthContext'

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}

