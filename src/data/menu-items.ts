import prisma from '@/lib/prisma'
import { MenuItem } from '@/lib/types'

export async function getMenuItems(eventId: string): Promise<MenuItem[]> {
  return await prisma.menuItem.findMany({
    where: { eventId },
    include: {
      event: {
        select: {
          name: true,
        },
      },
    },
  })
}

export async function createMenuItem(data: {
  name: string
  description: string
  price: number
  stock: number
  eventId: string
}): Promise<MenuItem> {
  return await prisma.menuItem.create({
    data,
    include: {
      event: {
        select: {
          name: true,
        },
      },
    },
  })
}

export async function updateMenuItem(
  id: string,
  data: {
    name?: string
    description?: string
    price?: number
    stock?: number
  }
): Promise<MenuItem> {
  return await prisma.menuItem.update({
    where: { id },
    data,
    include: {
      event: {
        select: {
          name: true,
        },
      },
    },
  })
}

export async function deleteMenuItem(id: string): Promise<MenuItem> {
  return await prisma.menuItem.delete({
    where: { id },
    include: {
      event: {
        select: {
          name: true,
        },
      },
    },
  })
}
