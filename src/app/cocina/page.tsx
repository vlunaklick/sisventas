'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { getOrders } from '../api/orders'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

export default function KitchenPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    refetchInterval: 60000, // Refetch every minute
  })

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user || user.role !== 'cocina') {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Pedidos en Cocina</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center">Cargando pedidos...</p>
          ) : isError ? (
            <p className="text-center text-red-500">Error al cargar pedidos</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <Card key={index}>
                  <CardContent>
                    <p>{order}</p>
                  </CardContent>
                </Card>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-gray-500">No hay pedidos pendientes</p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-green-500">Actualizando cada minuto</p>
          <Button onClick={handleLogout} variant="outline">
            Cerrar Sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
