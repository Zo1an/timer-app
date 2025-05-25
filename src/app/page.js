"use client";

import CountdownTimer from "@/components/countdowntimer";
import timerData from "../../public/data/timerdata.json";
import ReactRain from 'react-rain-animation';
import "react-rain-animation/lib/style.css";
import {addTimer} from "@/app/handleJSON";

export default function Home() {
   function handleNewClick() {
      const getRandomColor = () => {
         // Generate a vibrant color using HSL (high saturation and medium/high lightness)
         const hue = Math.floor(Math.random() * 360);
         return `hsl(${hue}, 90%, 55%)`;
      };
      const newTimer = {
         id: timerData.length + 1,
         name: "New Timer",
         duration: 60,
         color: getRandomColor(),
         styletype: "round",
         started: false,
         audio: "alarm"
      };
      addTimer(newTimer);
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
         <main className="absolute flex flex-wrap p-8 mt-32 gap-8 pb-24 items-center max-h-screen justify-center overflow-scroll">
            
            {timerData.map((timer) => (
               timer.id < 50 ? (
                  <CountdownTimer
                     key={timer.id}
                     id={timer.id}
                     name={timer.name}
                     duration={timer.duration}
                     color={timer.color}
                     styletype={timer.styletype}
                     started={timer.started}
                     audio={timer.audio}
                  />
               ) : null
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