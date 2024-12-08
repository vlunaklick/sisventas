import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchMenuItems, createOrder } from '@/lib/api/api'
import { MenuItem } from '@/lib/types'

interface OrderSheetProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  userId: string
}

export function OrderSheet({ isOpen, onClose, eventId, userId }: OrderSheetProps) {
  const [orderItems, setOrderItems] = useState<{ [key: string]: number }>({})
  const [customerIdentifier, setCustomerIdentifier] = useState('')
  const queryClient = useQueryClient()

  const { data: menuItems, isLoading: isLoadingMenuItems } = useQuery<MenuItem[]>({
    queryKey: ['menuItems', eventId],
    queryFn: () => fetchMenuItems(eventId),
    enabled: !!eventId,
  })

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', eventId] })
      setOrderItems({})
      setCustomerIdentifier('')
      onClose()
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
    if (items.length > 0) {
      mutation.mutate({ userId, eventId, items, customerIdentifier })
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Realizar Pedido</SheetTitle>
          <SheetDescription>Ingrese los detalles del pedido aquí.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="customerIdentifier">Identificador del Cliente</Label>
            <Input
              id="customerIdentifier"
              value={customerIdentifier}
              onChange={(e) => setCustomerIdentifier(e.target.value)}
              placeholder="Ej: Mesa 5, Juan Pérez, etc."
            />
          </div>
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
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Enviando...' : 'Enviar Pedido'}
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
