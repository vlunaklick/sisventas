import { Product } from '@prisma/client'
import prisma from '../lib/prisma'

export async function getProducts(): Promise<Product[]> {
  return await prisma.product.findMany()
}

export async function createProduct(name: string, description: string, price: number): Promise<Product> {
  return await prisma.product.create({
    data: {
      name,
      description,
      price,
    }
  })
}

