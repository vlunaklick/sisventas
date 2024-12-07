'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './contexts/AuthContext'
import { getOrders, createOrder } from './api/orders'
import { getProducts } from './api/products'
import { getEvents } from './api/events'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<{ [key: string]: number }>({})
  const { user, logout } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  })

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })

  const mutation = useMutation({
    mutationFn: (items: { productId: string, quantity: number }[]) => createOrder(user!.id, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setOrderItems({})
    },
  })

  const handleQuantityChange = (productId: string, quantity: number) => {
    setOrderItems(prev => ({
      ...prev,
      [productId]: quantity
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const items = Object.entries(orderItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({ productId, quantity }))
    if (items.length > 0) {
      mutation.mutate(items)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sistema de Pedidos</h1>
      <Button onClick={handleLogout} variant="outline" className="mb-4">
        Cerrar Sesión
      </Button>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Realizar Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isLoadingProducts ? (
              <p>Cargando productos...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Cantidad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={orderItems[product.id] || 0}
                          onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                          className="w-20"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Enviando...' : 'Enviar Pedido'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingEvents ? (
            <p>Cargando eventos...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events?.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>{new Date(event.date).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingOrders ? (
            <p>Cargando pedidos...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.user.username}</TableCell>
                    <TableCell>
                      {order.items.map((item) => (
                        <div key={item.id}>
                          {item.product.name} x {item.quantity}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      ${order.items.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)}
                    </TableCell>
                    <TableCell>{order.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

