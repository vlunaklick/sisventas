'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, ClipboardList, Users, Calendar, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import { useAuth } from './AuthContext'

export function AppSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const menuItems = [
    { icon: Home, label: 'Inicio', href: '/' },
    ...(user?.role === 'ADMIN' ? [
      { icon: ClipboardList, label: 'Admin', href: '/admin' },
      { icon: ClipboardList, label: 'Pedidos', href: '/caja' },
      { icon: ClipboardList, label: 'Cocina', href: '/cocina' },
    ] : []),
    ...(user?.role === 'CAJA' ? [
      { icon: ClipboardList, label: 'Pedidos', href: '/caja' },
    ] : []),
    ...(user?.role === 'COCINA' ? [
      { icon: ClipboardList, label: 'Cocina', href: '/cocina' },
    ] : []),
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-xl font-bold">Batallón 1</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}