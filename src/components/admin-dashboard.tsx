'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Event, MenuItem, User } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  fetchEvents,
  createEvent,
  fetchMenuItems,
  createMenuItem,
  fetchUsers,
  createUser
} from '@/lib/api/api'

export default function AdminDashboard() {
  const [eventName, setEventName] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [menuItemName, setMenuItemName] = useState('')
  const [menuItemDescription, setMenuItemDescription] = useState('')
  const [menuItemPrice, setMenuItemPrice] = useState('')
  const [menuItemStock, setMenuItemStock] = useState('')
  const [selectedEventId, setSelectedEventId] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'CAJA' | 'COCINA'>('CAJA')
  const queryClient = useQueryClient()

  const { data: events, isLoading: isLoadingEvents } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: fetchEvents,
  })

  const { data: menuItems, isLoading: isLoadingMenuItems } = useQuery<MenuItem[]>({
    queryKey: ['menuItems', selectedEventId],
    queryFn: () => fetchMenuItems(selectedEventId),
    enabled: !!selectedEventId,
  })

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  const eventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      setEventName('')
      setEventDescription('')
      setEventDate('')
    },
  })

  const menuItemMutation = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', selectedEventId] })
      setMenuItemName('')
      setMenuItemDescription('')
      setMenuItemPrice('')
      setMenuItemStock('')
    },
  })

  const userMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setUsername('')
      setPassword('')
      setRole('CAJA')
    },
  })

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    eventMutation.mutate({ name: eventName, description: eventDescription, date: eventDate })
  }

  const handleMenuItemSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedEventId) {
      menuItemMutation.mutate({
        name: menuItemName,
        description: menuItemDescription,
        price: parseFloat(menuItemPrice),
        stock: parseInt(menuItemStock),
        eventId: selectedEventId,
      })
    }
  }

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    userMutation.mutate({ username, password, role })
  }

  return (
    <div className="space-y-6">
    <h1 className="text-2xl font-bold">Panel de Administración</h1>

    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Crear Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEventSubmit} className="space-y-4">
            <Input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Nombre del evento"
              required
            />
            <Textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Descripción del evento"
              required
            />
            <Input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
            <Button type="submit" disabled={eventMutation.isPending}>
              {eventMutation.isPending ? 'Creando...' : 'Crear Evento'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crear Ítem del Menú</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMenuItemSubmit} className="space-y-4">
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
            <Input
              type="text"
              value={menuItemName}
              onChange={(e) => setMenuItemName(e.target.value)}
              placeholder="Nombre del ítem"
              required
            />
            <Textarea
              value={menuItemDescription}
              onChange={(e) => setMenuItemDescription(e.target.value)}
              placeholder="Descripción del ítem"
              required
            />
            <Input
              type="number"
              value={menuItemPrice}
              onChange={(e) => setMenuItemPrice(e.target.value)}
              placeholder="Precio"
              required
              step="0.01"
            />
            <Input
              type="number"
              value={menuItemStock}
              onChange={(e) => setMenuItemStock(e.target.value)}
              placeholder="Stock"
              required
            />
            <Button type="submit" disabled={menuItemMutation.isPending || !selectedEventId}>
              {menuItemMutation.isPending ? 'Creando...' : 'Crear Ítem del Menú'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crear Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
            <Select value={role} onValueChange={(value) => setRole(value as 'ADMIN' | 'CAJA' | 'COCINA')}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="CAJA">Caja</SelectItem>
                <SelectItem value="COCINA">Cocina</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={userMutation.isPending}>
              {userMutation.isPending ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>

    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Eventos</CardTitle>
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
          <CardTitle>Ítems del Menú</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingMenuItems ? (
            <p>Cargando ítems del menú...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingUsers ? (
            <p>Cargando usuarios...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre de Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
  )
}