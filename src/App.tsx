import { Hero } from './components/Hero'
import { Main } from './components/Main'
import { Members } from './components/Members/Members'
import { Nav } from './components/Nav'
import { Transactions } from './components/Transactions/Transactions'

function App() {
  return (
    <>
      <Nav />
      <Main>
        <Hero />
        <div className="flex flex-wrap gap-8 my-8">
          <Members />
          <Transactions />
        </div>
      </Main>
    </>
  )
}

export default App
