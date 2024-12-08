import { createProduct, getProducts } from '@/data/products'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ message: 'Error al obtener productos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, price } = await request.json()
    const newProduct = await createProduct(name, description, parseFloat(price))
    return NextResponse.json(newProduct, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Error al crear producto' }, { status: 500 })
  }
}

