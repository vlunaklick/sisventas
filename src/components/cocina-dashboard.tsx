'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Order, Event } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  fetchEvents,
  fetchOrders,
  updateOrderStatus
} from '@/lib/api/api'

export default function CocinaDashboard() {
  const [selectedEventId, setSelectedEventId] = useState('')
  const queryClient = useQueryClient()

  const { data: events } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: fetchEvents,
  })

  const { data: orders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ['orders', selectedEventId],
    queryFn: () => fetchOrders(selectedEventId),
    enabled: !!selectedEventId,
  })

  const mutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', selectedEventId] })
    },
  })

  const handleStatusChange = (orderId: string, newStatus: 'PENDIENTE' | 'EN_PREPARACION' | 'COMPLETADO') => {
    mutation.mutate({ orderId, status: newStatus })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de Cocina</h1>

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
                    <TableHead>Ítems</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.filter(order => order.status !== 'COMPLETADO').map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        {order.items.map((item) => (
                          <div key={item.id}>
                            {item.id} x {item.quantity}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>
                        {order.status === 'PENDIENTE' && (
                          <Button onClick={() => handleStatusChange(order.id, 'EN_PREPARACION')}>
                            Iniciar Preparación
                          </Button>
                        )}
                        {order.status === 'EN_PREPARACION' && (
                          <Button onClick={() => handleStatusChange(order.id, 'COMPLETADO')}>
                            Marcar como Completado
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
