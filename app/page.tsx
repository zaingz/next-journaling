import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="w-screen h-screen bg-slate-800 flex justify-center items-center text-slate-100">
      <div className="w-full max-w-[720px] mx-auto">
        <h1 className="text-6xl">The Next Journaling App</h1>
        <p className="text-xl text-slate-500 mt-2 mb-8">
          This is the next generation of journaling and mood tracking. Start
          journaling and uncover the trends using AI
        </p>
        <div>
          <Link href="/journal">
            <button className="bg-orange-500 px-4 py-2 rounded-lg text-md">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
