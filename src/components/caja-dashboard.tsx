'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Order, MenuItem, Event } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  fetchEvents,
  fetchMenuItems,
  fetchOrders,
  createOrder
} from '@/lib/api/api'
import { useAuth } from './AuthContext'

export default function CajaDashboard() {
  const [selectedEventId, setSelectedEventId] = useState('')
  const [orderItems, setOrderItems] = useState<{ [key: string]: number }>({})
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: events } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: fetchEvents,
  })

  const { data: menuItems, isLoading: isLoadingMenuItems } = useQuery<MenuItem[]>({
    queryKey: ['menuItems', selectedEventId],
    queryFn: () => fetchMenuItems(selectedEventId),
    enabled: !!selectedEventId,
  })

  const { data: orders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ['orders', selectedEventId],
    queryFn: () => fetchOrders(selectedEventId),
    enabled: !!selectedEventId,
  })

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', selectedEventId] })
      setOrderItems({})
    },
  })

  const handleQuantityChange = (menuItemId: string, quantity: number) => {
    setOrderItems(prev => ({
      ...prev,
      [menuItemId]: quantity
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const items = Object.entries(orderItems)
      .filter(([, quantity]) => quantity > 0)
      .map(([menuItemId, quantity]) => ({ menuItemId, quantity }))
    if (items.length > 0 && user && selectedEventId) {
      mutation.mutate({ userId: user.id, eventId: selectedEventId, items })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de Caja</h1>

      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un evento" />
            </SelectTrigger>
            <SelectContent>
              {events?.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedEventId && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Realizar Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isLoadingMenuItems ? (
                  <p>Cargando menú...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ítem</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Cantidad</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menuItems?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>{item.stock}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max={item.stock}
                              value={orderItems[item.id] || 0}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
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

          <Card>
            <CardHeader>
              <CardTitle>Pedidos del Evento</CardTitle>
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
                      <TableHead>Ítems</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders?.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.userId}</TableCell>
                        <TableCell>
                          {order.items.map((item) => (
                            <div key={item.id}>
                              {item.menuItemId} x {item.quantity}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>
                          ${order.items.reduce((total, item) => {
                            const menuItem = menuItems?.find(mi => mi.id === item.menuItemId)
                            return total + (menuItem?.price || 0) * item.quantity
                          }, 0).toFixed(2)}
                        </TableCell>
                        <TableCell>{order.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
