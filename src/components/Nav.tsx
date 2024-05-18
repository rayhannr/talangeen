import { ThemeToggler } from './ThemeToggler'

export const Nav = () => {
  return (
    <nav className="flex flex-row justify-center py-4 px-4 sm:px-0 sm:w-3/4 lg:w-5/6 sm:m-auto font-medium">
      <div className="flex justify-end items-center w-full">
        <ThemeToggler />
      </div>
    </nav>
  )
}
