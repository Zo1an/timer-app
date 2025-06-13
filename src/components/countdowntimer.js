"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Progress } from "antd";

export default function CountdownTimer(props) {
   const [timer, setTimer] = useState(props.duration);
   const [isStarted, setIsStarted] = useState(props.started);
   const audioRef = useRef(null);
   const [isHovered, setIsHovered] = useState(false);

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

   // Button configs for round style
   const roundButtons = [
      { text: "+5m", value: 300 },
      { text: "+1m", value: 60 },
      { text: "-1m", value: -60 },
      { text: "-5m", value: -300 },
      { text: "-10m", value: -600 },
      { text: "-30m", value: -1800 },
      { text: "+30m", value: 1800 },
      { text: "+10m", value: 600 },
   ];

   return (
      <div
         className={`p-4 rounded-lg shadow-lg text-center bg-gray-800/20 backdrop-blur-[6px] backdrop-saturate-[100%] border border-opacity-20 border-white ${props.styletype === 'round' ? 'w-64 h-64' : ''} ${props.styletype === 'progress' ? 'w-80 h-48 flex flex-col' : ''}`}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         style={{ position: 'relative' }}
      >
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
         {props.styletype === 'round' ? (
            <div className='relative flex items-center justify-center'>
               <Progress
                  type="circle"
                  percent={(timer / props.duration) * 100}
                  format={() => formatSeconds(timer)}
                  strokeColor={props.color}
                  status="normal"
               />
               <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}>
                  {roundButtons.map((btn, i) => {
                     const angle = (22.5 + i * (360 / roundButtons.length)) * Math.PI / 180;
                     const radius = 56;
                     const x = Math.cos(angle) * radius;
                     const y = Math.sin(angle) * radius;
                     return (
                        <div
                           key={btn.text}
                           style={{
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              transform: isHovered
                                 ? `translate(-50%, -50%) translate(${x}px, ${y}px)`
                                 : 'translate(-50%, -50%) translate(0, 0)',
                              transition: 'transform 0.4s cubic-bezier(.4,2,.6,1)',
                              pointerEvents: 'auto',
                           }}
                        >
                           <TimerButton
                              text={btn.text}
                              color={props.color}
                              timervalue={btn.value}
                              onClick={() => {
                                 props.onSetDuration(props.id, props.duration + btn.value);
                                 setTimer(t => t + btn.value);
                              }}
                           />
                        </div>
                     );
                  })}
               </div>
            </div>
         ) : props.styletype === 'progress' ? (
            <Progress
               percent={(timer / props.duration) * 100}
               format={() => formatSeconds(timer)}
               strokeColor={props.color}
               percentPosition={{ align: 'center', type: 'outer' }}
               size={12}
               status="normal"
            />
         ) : null}
         <br />
         <div className='flex justify-center gap-2'>
            <button className={`${timer <= 0 ? 'hidden' : ''} border border-white-500 text-white px-4 py-2 rounded`}
               onClick={() => { setIsStarted(!isStarted); stopAudio(); }}>
               {isStarted ? "Stop" : "Start"}
            </button>
            <button className='border border-white-500 text-white px-4 py-2 rounded'
               onClick={() => { setIsStarted(false); setTimer(props.duration); stopAudio(); }}>
               Reset
            </button>
         </div>
         <button className='absolute top-1 right-1 bg-[url(/img/x.svg)] bg-center bg-no-repeat text-white w-8 h-8 rounded'
            onClick={() => props.onDelete(props.id)} />
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

export function TimerButton(props){
   return (
      <button
         className="text-xs bottom-1 left-1 shrink-0 grow-0 rounded-full text-white w-8 h-8"
         style={{ backgroundColor: props.color+"AA", border: "1px solid "+props.color }}
         onClick={props.onClick}
      >
         {props.text}
      </button>
   )
}