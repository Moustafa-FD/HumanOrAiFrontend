"use client";
import { useState  } from "react";
import Link from 'next/link'

export default function Home() {

  const [singlePlayer, setSinglePlayer] = useState(true); 


  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="row-start-1 flex items-left w-full">
        <h1 className="text-2xl font-bold text-zinc-400">MO-FD</h1>
      </div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="text-6xl font:bold ">Human VS AI</h1>
        <Link href={singlePlayer ? "1v1" : "group"} className="bg-orange-600 hover:bg-orange-400 hover:scale-105 transition duration-250 py-3 px-8 text-3xl font-bold text-black rounded-2xl border shadow flex items-center">
          Start
        </Link>
      </main>
      <footer className="row-start-3 flex items-center flex-col gap-8">
        
        <h1 className="text-3xl font-semibold">Game Mode</h1>
        <div className="flex gap-[24px] flex-wrap items-center justify-center text-black text-xl font-bold">
          <div className={singlePlayer ? "bg-orange-600 rounded-2xl py-1 px-4 transition duration-300 hover:scale-105" : "bg-white text-gray-700 hover:bg-orange-400 rounded-2xl py-1 px-4 transition duration-300 hover:scale-105"} onClick={() => setSinglePlayer(true)}>
            1 v 1
          </div>
          <div className={!singlePlayer ? "bg-orange-600 rounded-2xl py-1 px-4 transition duration-300 hover:scale-105" : "bg-zinc-400 text-gray-700 hover:bg-orange-400 rounded-2xl py-1 px-4 transition duration-300 hover:scale-105"} onClick={() => setSinglePlayer(false)}>
            2 v 5
          </div>
        </div>
      </footer>
    </div>
  );
}
