import { Event } from '@prisma/client'
import prisma from '../../lib/prisma'

export async function getEvents(): Promise<Event[]> {
  return await prisma.event.findMany({
    orderBy: {
      date: 'asc'
    }
  })
}

export async function createEvent(name: string, description: string, date: Date): Promise<Event> {
  return await prisma.event.create({
    data: {
      name,
      description,
      date,
    }
  })
}

