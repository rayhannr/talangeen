import { Hero } from './components/Hero'
import { Main } from './components/Main'
import { Members } from './components/Members/Members'
import { Nav } from './components/Nav'

function App() {
  return (
    <>
      <Nav />
      <Main>
        <Hero />
        <div className="flex flex-wrap gap-6 my-8">
          <Members />
        </div>
      </Main>
    </>
  )
}

export default App
