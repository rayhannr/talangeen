import { Button } from '@nextui-org/button'
import { useLayoutEffect } from 'react'

const DARK_THEME_CLASS = 'dark'
const COLOR_MODE = 'colorMode'
const LIGHT_THEME = 'light'
const DARK_THEME = 'dark'
const root = document.documentElement
const metaThemeColor = document.querySelector('meta[name="theme-color"]')

export const ThemeToggler = () => {
  const onToggle = () => {
    root.classList.toggle(DARK_THEME_CLASS)

    const colorMode = root.classList.contains(DARK_THEME_CLASS) ? DARK_THEME : LIGHT_THEME
    const metaColor = colorMode === DARK_THEME ? '#0c0a09' : '#f8fafc'

    localStorage.setItem(COLOR_MODE, colorMode)
    metaThemeColor?.setAttribute('content', metaColor)
  }

  const getInitialColorMode = () => {
    const prevColorMode = localStorage.getItem(COLOR_MODE)

    if (prevColorMode) return prevColorMode
    if (window.matchMedia('prefers-color-scheme: dark').matches) {
      return DARK_THEME
    }

    return LIGHT_THEME
  }

  const setInitialColorMode = (mode: string) => {
    let color = '#f8fafc'

    if (mode === LIGHT_THEME) {
      root.classList.remove(DARK_THEME_CLASS)
    } else {
      root.classList.add(DARK_THEME_CLASS)
      color = '#0c0a09'
    }
    metaThemeColor?.setAttribute('content', color)
  }

  useLayoutEffect(() => {
    const initialColorMode = getInitialColorMode()
    setInitialColorMode(initialColorMode)
  }, [])

  return (
    <Button
      aria-label="theme toggler"
      className="rounded-full border-0 p-2 transition-all hover:scale-90 active:scale-100 outline-none"
      onClick={onToggle}
      variant="light"
      isIconOnly
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        width="24"
        height="24"
      >
        <path
          className="stroke-transparent dark:stroke-[unset]"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
        ></path>
        <path
          className="dark:stroke-transparent"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
        ></path>
      </svg>
    </Button>
  )
}
