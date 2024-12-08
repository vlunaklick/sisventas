import HomePage from '@/components/home-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inicio - Sistema de Pedidos de Restaurante',
  description: 'Página de inicio del sistema de gestión de pedidos para restaurantes',
}

export default function Home() {
  return (
    <HomePage />
  )
}

