"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Progress } from "antd";
import { deleteTimer } from "@/app/handleJSON_tau";

export default function CountdownTimer(props) {
   const [timer, setTimer] = useState(props.duration);
   const [isStarted, setIsStarted] = useState(props.started);
   const audioRef = useRef(null);

   useEffect(() => {
      if (timer === 0) {
         if (!audioRef.current) {
            audioRef.current = new Audio('../../audio/alarm.mp3');
         }
         audioRef.current.currentTime = 0;
         audioRef.current.play();
         return;
      }

      const intervalId = isStarted ? setInterval(() => setTimer(t => t - 1), 1000) : null;

      return () => clearInterval(intervalId);
   }, [timer, isStarted]);

   // Stop audio when Stop or Reset is pressed
   const stopAudio = () => {
      if (audioRef.current) {
         audioRef.current.pause();
         audioRef.current.currentTime = 0;
      }
   };

   const [isEditing, setIsEditing] = useState(false);
   const [editedName, setEditedName] = useState(props.name);

   const handleNameClick = () => {
      setIsEditing(true);
   };

   const handleNameChange = (e) => {
      setEditedName(e.target.value);
   };

   const handleNameBlur = () => {
      setIsEditing(false);
      if (props.onNameChange) {
         props.onNameChange(editedName, props.id);
      }
   };

   const handleNameKeyDown = (e) => {
      if (e.key === 'Enter') {
         setIsEditing(false);
         if (props.onNameChange) {
            props.onNameChange(editedName, props.id);
         }
      }
   };

   return (
      <div className={`p-4 rounded-lg shadow-lg text-center bg-gray-800/20 backdrop-blur-[6px] backdrop-saturate-[100%] border border-opacity-20 border-white ${props.styletype === 'round' && 'w-64 h-64'} ${props.styletype === 'progress' && 'w-80 h-48 flex flex-col'}`}>
         {isEditing ? (
            <input
               className="font-sans text-lg mb-4 bg-transparent border-b border-white outline-none text-white text-center"
               value={editedName}
               onChange={handleNameChange}
               onBlur={handleNameBlur}
               onKeyDown={handleNameKeyDown}
               autoFocus
            />
         ) : (
            <p className='font-sans text-lg mb-4 cursor-pointer' onClick={handleNameClick}>
               {editedName}
            </p>
         )}
         {props.styletype === 'round' && (
            <><Progress
               className='mb-4'
               type="circle"
               percent={(timer / props.duration) * 100}
               format={() => `${formatSeconds(timer)}`}
               strokeColor={props.color}
               status="normal"
            /></>
         )}
         {props.styletype === 'progress' && (
            <><Progress
               className='mb-4'
               percent={(timer / props.duration) * 100}
               format={() => `${formatSeconds(timer)}`}
               strokeColor={props.color}
               percentPosition={{ align: 'center', type: 'outer' }}
               size={12}
               status="normal"
            /></>
         )}
         <br />
         <div className='flex justify-center gap-2'>
            <button className={`${timer <= 0 ? 'hidden' : ''} border border-white-500 text-white px-4 py-2 rounded`}
                     onClick={() => { setIsStarted(!isStarted); stopAudio(); }} >
               {isStarted ? "Stop" : "Start"}
            </button>
            <button className='border border-white-500 text-white px-4 py-2 rounded'
                     onClick={() => { setIsStarted(false); setTimer(props.duration); stopAudio(); }} >
               Reset
            </button>
         </div>
         <button className='absolute top-1 right-1 bg-[url(/img/x.svg)] bg-center bg-no-repeat text-white w-8 h-8 rounded'
                  onClick={() => props.onDelete(props.id) } >
         </button>
      </div>
   );
}

function formatSeconds(totalSeconds) {
   const hours = Math.floor(totalSeconds / 3600);
   const minutes = Math.floor((totalSeconds % 3600) / 60);
   const seconds = totalSeconds % 60;

   if (hours > 0) {
      return [
         hours.toString().padStart(2, '0'),
         minutes.toString().padStart(2, '0'),
         seconds.toString().padStart(2, '0')
      ].join(':');
   } else if (minutes > 0) {
      return [
         minutes.toString().padStart(2, '0'),
         seconds.toString().padStart(2, '0')
      ].join(':');
   } else {
      return seconds.toString();
   }
}