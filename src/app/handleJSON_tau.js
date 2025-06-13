import { readTextFile, writeTextFile, exists, create } from '@tauri-apps/plugin-fs';
import { BaseDirectory } from '@tauri-apps/plugin-fs';
import { join, appDataDir, desktopDir } from '@tauri-apps/api/path';

export async function getTimerDataFilePath() {
    return await join(await desktopDir(), 'timerdata.json');
}

export async function getOptionsFilePath() {
    return await join(await desktopDir(), 'options.json');
}


export async function getTimers() {
    const filePath = await getTimerDataFilePath();
    if (await exists(filePath)) {
        const data = await readTextFile(filePath);
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
    await writeTextFile(filePath, JSON.stringify(timers, null, 2));
    return newTimer;
}

export async function updateTimer(timerId, key, value) {
    const filePath = await getTimerDataFilePath();
    let timers = await getTimers();

    const index = timers.findIndex(timer => timer.id === timerId);
    if (index === -1) {
        return null; // Timer not found
    }

    timers[index][key] = value;

    await writeTextFile(filePath, JSON.stringify(timers, null, 2));
    return timers[index];
}

export async function deleteTimer(timerId) {
    const filePath = await getTimerDataFilePath();
    let timers = await getTimers();

    // Filter out the timer with the given id
    const updatedTimers = timers.filter(timer => timer.id !== timerId);
    // Write updated timers back to file
    await writeTextFile(filePath, JSON.stringify(updatedTimers, null, 2));
    return updatedTimers;
}

export async function getOptions() {
    const filePath = await getOptionsFilePath();
    if (await exists(filePath)) {
        const data = await readTextFile(filePath);
        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    }
    return [];
}