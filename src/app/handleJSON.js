"use server";

import fs from 'fs';
import path from 'path';

export async function getTimerDataFilePath() {
    return path.join(process.cwd(), 'public', 'data', 'timerdata.json');
}

export async function getTimers() {
    const filePath = await getTimerDataFilePath();
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    }
    return [];
}

export async function addTimer(newTimer) {
    const filePath = await getTimerDataFilePath();
    let timers = await getTimers();

    // Check if timer with the same id already exists
    if (timers.some(timer => timer.id === newTimer.id)) {
        return null; // Do not add if id exists
    }

    // Add new timer
    timers.push(newTimer);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(timers, null, 2), 'utf-8');
    return newTimer;
}

export async function deleteTimer(timerId) {
    const filePath = await getTimerDataFilePath();
    let timers = await getTimers();

    // Filter out the timer with the given id
    const updatedTimers = timers.filter(timer => timer.id !== timerId);
console.error(`Deleting timer with ID: ${timerId}`);
    // Write updated timers back to file
    fs.writeFileSync(filePath, JSON.stringify(updatedTimers, null, 2), 'utf-8');
    return updatedTimers;
}