import { Github } from './Icons/Github'
import { ThemeToggler } from './ThemeToggler'

export const Nav = () => {
  return (
    <nav className="sticky top-0 z-50 flex flex-row justify-center p-2 sm:px-0 sm:w-3/4 lg:w-5/6 sm:m-auto font-medium bg-background">
      <div className="flex justify-end items-center w-full gap-2">
        <a href="https://github.com/rayhannr/talangeen" target="_blank" rel="noreferrer">
          <Github className="w-5 h-5" />
        </a>
        <ThemeToggler />
      </div>
    </nav>
  )
}
