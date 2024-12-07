import { Order } from '@prisma/client'
import prisma from '../../lib/prisma'

export async function getOrders(): Promise<Order[]> {
  return await prisma.order.findMany({
    include: {
      user: {
        select: {
          username: true,
        }
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            }
          },
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function createOrder(userId: string, items: { productId: string, quantity: number }[]): Promise<Order> {
  return await prisma.order.create({
    data: {
      userId,
      items: {
        create: items.map(item => ({
          quantity: item.quantity,
          product: {
            connect: { id: item.productId }
          }
        }))
      }
    },
    include: {
      user: {
        select: {
          username: true,
        }
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            }
          },
        }
      }
    }
  })
}

export async function updateOrderStatus(orderId: string, status: 'pendiente' | 'en_preparacion' | 'completado'): Promise<Order> {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      user: {
        select: {
          username: true,
        }
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            }
          },
        }
      }
    }
  })
}
