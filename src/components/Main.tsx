import { PropsWithChildren } from 'react'

export const Main = ({ children }: PropsWithChildren) => (
  <main className="flex flex-col flex-grow flex-1 px-4 sm:px-0 w-full sm:w-3/4 lg:w-5/6 m-auto mt-8">{children}</main>
)
