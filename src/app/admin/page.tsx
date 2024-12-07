'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProducts, createProduct } from '../api/products'
import { getEvents, createEvent } from '../api/events'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { useAuth } from '@/components/AuthContext'

export default function AdminPage() {
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [eventName, setEventName] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const { user, logout } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })

  const productMutation = useMutation({
    mutationFn: (data: { name: string, description: string, price: number }) => createProduct(data.name, data.description, data.price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setProductName('')
      setProductDescription('')
      setProductPrice('')
    },
  })

  const eventMutation = useMutation({
    mutationFn: (data: { name: string, description: string, date: Date }) => createEvent(data.name, data.description, data.date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      setEventName('')
      setEventDescription('')
      setEventDate('')
    },
  })

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    productMutation.mutate({ name: productName, description: productDescription, price: parseFloat(productPrice) })
  }

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    eventMutation.mutate({ name: eventName, description: eventDescription, date: new Date(eventDate) })
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user || user.role !== 'admin') {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <Button onClick={handleLogout} variant="outline" className="mb-4">
        Cerrar Sesión
      </Button>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Crear Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <Input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Nombre del producto"
                required
              />
              <Textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Descripción del producto"
                required
              />
              <Input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="Precio"
                required
                step="0.01"
              />
              <Button type="submit" disabled={productMutation.isPending}>
                {productMutation.isPending ? 'Creando...' : 'Crear Producto'}
              </Button>
            </form>
          </CardContent>
        </Card>

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
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Productos</h2>
        {isLoadingProducts ? (
          <p>Cargando productos...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Precio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Eventos</h2>
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
      </div>
    </div>
  )
}