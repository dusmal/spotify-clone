import { faCirclePlay, faCircleStop } from '@fortawesome/free-solid-svg-icons';
export let debounceTimeout: number;

export const debounce = (func: Function, delay: number) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(func, delay);
}

export const pluralize = (word: string, count: number): string => {
    return count === 1 ? word : `${word}s`;
}

export const formatMillisecondsToTime = (milliseconds: number): string => {
    let totalSeconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let hours = Math.floor(minutes / 60);
    let seconds = totalSeconds % 60;
    return hours > 0 ? `${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const formatDateToUSLocale = (date: string): string => {
    const d = new Date(date);
    const options = { year: 'numeric', month: 'short', day: 'numeric' } as const;;
    return d.toLocaleDateString('en-US', options);
}

export const formatTime = (ms: number, approximation: boolean): string => {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds %= 60;
    minutes %= 60;

    let formattedTime = '';
    if (approximation) {
        if (hours > 0) {
            formattedTime = `about ${hours}h`
        }
        else {
            formattedTime = `about ${minutes}min`
            if (minutes < 1) {
                formattedTime = `about ${minutes}sec`
            }
        }
    }
    else {
        formattedTime = `${hours ? hours + 'hr' : ''} ${minutes}min`;
    }
    return formattedTime;
}

export const getPlayPauseIcon = (bool:boolean|null) => {
    return bool ? faCirclePlay : faCircleStop;
}