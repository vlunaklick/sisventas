import prisma from '../../lib/prisma'

export async function getProducts() {
  return await prisma.product.findMany()
}

export async function createProduct(name: string, description: string, price: number) {
  return await prisma.product.create({
    data: {
      name,
      description,
      price,
    }
  })
}

