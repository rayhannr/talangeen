import { Hero } from './components/Hero'
import { Main } from './components/Main'
import { Members } from './components/Members/Members'
import { Nav } from './components/Nav'
import { Result } from './components/Result/Result'
import { Transactions } from './components/Transactions/Transactions'

function App() {
  return (
    <>
      <Nav />
      <Main>
        <Hero />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-8">
          <Members />
          <Transactions />
        </div>
        <Result />
      </Main>
    </>
  )
}

export default App
