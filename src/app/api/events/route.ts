import { createEvent, getEvents } from '@/data/events'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const events = await getEvents()
    return NextResponse.json(events)
  } catch {
    return NextResponse.json({ message: 'Error al obtener eventos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, date } = await request.json()
    const newEvent = await createEvent(name, description, new Date(date))
    return NextResponse.json(newEvent, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Error al crear evento' }, { status: 500 })
  }
}

