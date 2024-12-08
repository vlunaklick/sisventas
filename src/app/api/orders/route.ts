import { createOrder, getOrders, updateOrderStatus } from '@/data/orders'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const orders = await getOrders()
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ message: 'Error al obtener órdenes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, items } = await request.json()
    const newOrder = await createOrder(userId, items)
    return NextResponse.json(newOrder, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Error al crear orden' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { orderId, status } = await request.json()
    const updatedOrder = await updateOrderStatus(orderId, status)
    return NextResponse.json(updatedOrder)
  } catch {
    return NextResponse.json({ message: 'Error al actualizar estado de la orden' }, { status: 500 })
  }
}

