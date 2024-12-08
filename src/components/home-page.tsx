'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAuth } from './AuthContext'

export default function HomePage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()


  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/login')
    } else {
      setIsLoading(false)
    }
  }, [user, isLoading])

  if (isLoading || !user) return null

  return (
    <main className="flex-1 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido, {user.username}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Rol: {user.role}</p>
          <p className="mt-4">Selecciona una opción del menú para comenzar.</p>
        </CardContent>
      </Card>
    </main>
  )
}