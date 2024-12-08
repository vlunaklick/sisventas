'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Order, Event } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  fetchEvents,
  fetchOrders,
} from '@/lib/api/api'
import { useAuth } from './AuthContext'
import { OrderSheet } from './caja/order-sheet'

export default function CajaDashboard() {
  const [selectedEventId, setSelectedEventId] = useState('')
  const [isOrderSheetOpen, setIsOrderSheetOpen] = useState(false)
  const { user } = useAuth()
  
  const { data: events } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: fetchEvents,
  })

  const { data: orders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ['orders', selectedEventId],
    queryFn: () => fetchOrders(selectedEventId),
    enabled: !!selectedEventId,
  })

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
          <Button onClick={() => setIsOrderSheetOpen(true)}>Realizar Pedido</Button>
          
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
                      <TableHead>Cliente</TableHead>
                      <TableHead>Ítems</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders?.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customerIdentifier}</TableCell>
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
        </>
      )}

      {user && (
        <OrderSheet
          isOpen={isOrderSheetOpen}
          onClose={() => setIsOrderSheetOpen(false)}
          eventId={selectedEventId}
          userId={user.id}
        />
      )}
    </div>
  )
}
