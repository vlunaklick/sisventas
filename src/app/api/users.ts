import prisma from '../../lib/prisma'
import { hash } from 'bcrypt'

export async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
    }
  })
}

export async function createUser(username: string, password: string, role: string) {
  const hashedPassword = await hash(password, 10)
  return await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role,
    }
  })
}
