"use client";

import CountdownTimer from "@/components/countdowntimer";
import ReactRain from 'react-rain-animation';
import "react-rain-animation/lib/style.css";
import { addTimer, getTimers, deleteTimer } from "@/app/handleJSON_tau";
import { useEffect, useState } from "react";

// Simple skeleton component
function TimerSkeleton() {
   return (
      <div className="w-64 h-64 text-center items-center animate-pulse p-4 rounded-lg shadow-lg bg-gray-800/20 backdrop-blur-[6px] backdrop-saturate-[100%] border border-opacity-20 border-white flex flex-col">
         <div className="w-24 h-3 my-2 bg-gray-400/40 rounded font-sans text-lg mb-6"></div>
         <div className="w-[113px] h-[113px] border-8 border-gray-400/40 rounded-full mb-4"></div>
         <div className="w-32 h-11 border-2 border-gray-400/30 px-4 py-2 rounded"></div>
         <div className="absolute top-1 right-1 bg-gray-400/40 w-4 h-4 m-2 rounded"></div>
      </div>
   );
}

export default function Home() {
   const [timers, setTimers] = useState([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      async function fetchTimers() {
         const data = await getTimers();
         setTimers(data);
      }
      fetchTimers();
   }, []);

   // Helper to refresh timers
   const refreshTimers = async () => {
      const data = await getTimers();
      setTimers(data);
      setLoading(false);
   };

   function handleNewClick() {
      setLoading(true);
      const getRandomColor = () => {
         const hue = Math.floor(Math.random() * 360);
         return `hsl(${hue}, 90%, 55%)`;
      };
      const newTimer = {
         id: Math.floor(Math.random() * 1000000),
         name: "New Timer",
         duration: 60,
         color: getRandomColor(),
         styletype: "round",
         started: false,
         audio: "alarm"
      };
      addTimer(newTimer).then(refreshTimers);
   }

   function onDeleteTimer(id) {
      deleteTimer(id).then(refreshTimers);
   }

   return (
      <div className="grid items-center justify-items-center min-h-screen">
         <button className='absolute top-2 border border-white-500 text-white px-3 py-2 rounded shadow-lg bg-gray-800/20 backdrop-blur-[6px] backdrop-saturate-[100%] border-opacity-20 border-white'
                  onClick={handleNewClick} >
            <div className="bg-[url(/img/x.svg)] rotate-45 bg-center bg-no-repeat w-3 h-3 inline-block mr-2"></div>
            New timer
         </button>
         <ReactRain
            numDrops="500"
         />
         <main className="absolute transition-all flex flex-wrap p-8 mt-32 gap-8 pb-24 items-center max-h-screen justify-center overflow-scroll">
            {loading && <TimerSkeleton />}
            {timers.map((timer) => (
               <CountdownTimer
                  key={timer.id}
                  id={timer.id}
                  name={timer.name}
                  duration={timer.duration}
                  color={timer.color}
                  styletype={timer.styletype}
                  started={timer.started}
                  audio={timer.audio}
                  onDelete={onDeleteTimer}
               />
            ))}
            <button
               className="fixed top-2 text-4xl right-2 w-10 h-10 transition border border-white-500 text-white rounded bg-gray-800/20 backdrop-blur-[6px] backdrop-saturate-[100%] border-opacity-20 border-white bg-[url(/img/gear_filled.svg)] bg-auto bg-center bg-no-repeat"
               onClick={() => alert("This is a test button!")}
            >
            </button>
         </main>
      </div>
   );
}
