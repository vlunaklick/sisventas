export interface User {
  id: string
  username: string
  role: 'ADMIN' | 'CAJA' | 'COCINA'
}

export interface Event {
  id: string
  name: string
  description: string
  date: Date
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  stock: number
  eventId: string
}

export interface Order {
  id: string
  createdAt: Date
  updatedAt: Date
  status: 'PENDIENTE' | 'EN_PREPARACION' | 'COMPLETADO'
  userId: string
  eventId: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  quantity: number
  menuItemId: string
  orderId: string
}

