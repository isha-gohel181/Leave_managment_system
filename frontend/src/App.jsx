import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-2xl space-y-6 text-center transform transition-all hover:scale-[1.01]">
        
        {/* Logos Container */}
        <div className="flex justify-center items-center gap-6 mb-4">
          <a href="https://vite.dev" target="_blank" rel="noreferrer" className="transition-transform hover:scale-110 duration-300">
            <img src={viteLogo} className="h-14 w-auto animate-pulse" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer" className="transition-transform hover:scale-110 duration-300">
            <img src={reactLogo} className="h-14 w-auto animate-[spin_10s_linear_infinite]" alt="React logo" />
          </a>
        </div>

        {/* Checkmark Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mb-2 border border-emerald-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 animate-bounce">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Tailwind CSS works!
        </h2>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed">
          If this card is styled with a dark slate background, centered, and contains a teal-gradient title along with interactive components, it confirms that Tailwind CSS v4 is successfully configured.
        </p>

        {/* Button & Counter */}
        <div className="pt-4 border-t border-slate-700/50">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
          >
            Count is: {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

