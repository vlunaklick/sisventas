import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Order } from '@/lib/types'

interface OrderDetailsModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalles del Pedido</DialogTitle>
          <DialogDescription>
            ID del Pedido: {order.id}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h4 className="text-sm font-medium">Cliente: {order.customerIdentifier}</h4>
          <p className="text-sm text-muted-foreground">Estado: {order.status}</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ítem</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.menuItem?.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${(item.menuItem?.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-4 text-sm font-medium">
            Total: ${order.items.reduce((total, item) => total + item.menuItem?.price * item.quantity, 0).toFixed(2)}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}