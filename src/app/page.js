"use client";

import CountdownTimer from "@/components/countdowntimer";
import timerData from "../../public/timerdata.json";
import ReactRain from 'react-rain-animation';
import "react-rain-animation/lib/style.css";

export default function Home() {
   return (
      <div className="grid items-center justify-items-center min-h-screen p-8">
         <main className="flex flex-wrap gap-8 items-center justify-center">
            <ReactRain
               numDrops="500"
            />
            {timerData.map((timer) => (
               <CountdownTimer
               key={timer.id}
               name={timer.name}
               duration={timer.duration}
               color={timer.color}
               styletype={timer.styletype}
               started={timer.started}
               />
            ))}
            <button
               className="fixed top-2 text-4xl right-2 w-10 h-10 transition border border-white-500 text-white rounded"
            >
               ⚙
            </button>
         </main>
      </div>
   );
}