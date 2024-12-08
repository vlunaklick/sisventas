import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export const ThemeChanger = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="p-3 rounded-md"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <>
          <SunIcon className="w-6 h-6" />
          <span className="sr-only">Cambiar a modo claro</span>
        </>
      ) : (
        <>
          <MoonIcon className="w-6 h-6" />
          <span className="sr-only">Cambiar a modo oscuro</span>
        </>
      )}
    </button>
  )
}