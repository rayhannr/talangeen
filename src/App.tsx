import { Nav } from './components/Nav'

function App() {
  return (
    <>
      <Nav />
      <main className="flex flex-col flex-grow flex-1 px-4 sm:px-0 w-full sm:w-3/4 m-auto mt-8">
        <div className="text-center text-balance">
          <h1 className="font-extrabold text-5xl md:text-7xl mb-6">Talangeen</h1>
          <p className="opacity-80 dark:opacity-60">
            Buat nge-<i>track</i> tagihan dan pengeluaran bersama biar orang yang nalangin dapet kembalian yang sesuai
          </p>
        </div>
      </main>
    </>
  )
}

export default App
