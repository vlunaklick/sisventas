import prisma from '../../lib/prisma'

export async function getOrders() {
  return await prisma.order.findMany({
    include: {
      user: {
        select: {
          username: true,
        }
      },
      items: {
        include: {
          product: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function createOrder(userId: string, items: { productId: string, quantity: number }[]) {
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
      items: {
        include: {
          product: true,
        }
      }
    }
  })
}