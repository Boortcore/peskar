import { getDayNumberOfYear, padTo2Digits } from './helpers';
import * as CONSTANTS from './constants';

const { PERIOD_ID, MESSAGES_MAP } = CONSTANTS;
const workingNightNumber = getDayNumberOfYear(new Date(2022, 6, 21, 0, 0, 0, 0));
const workingDayNumber = getDayNumberOfYear(new Date(2022, 6, 20, 0, 0, 0, 0));
const daySummary = 4;
export const isDayWorking = (day) => {
    return (day - workingDayNumber) % daySummary === 0;
};

export const isNightWorking = (day) => {
    return (day - workingNightNumber) % daySummary === 0;
};

export const isAfterWorkingNightDay = (day) => {
    return (day - workingDayNumber) % daySummary === 2;
};

export const getWorkingInfo = (date) => {
    const chosenDay = getDayNumberOfYear(date);
    return {
        isDayWorking: isDayWorking(chosenDay),
        isNightWorking: isNightWorking(chosenDay),
        isAfterWorkingNightDay: isAfterWorkingNightDay(chosenDay),
    };
};

const allDayLengthInSeconds = 24 * 60 * 60;
const startDayShift = 8 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const dayShiftLenght = 12 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const endDayShift = 20 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const startNightShift = 20 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const endNightShift = 8 /* hours */ * 60 /* minutes */ * 60; /* seconds */

export function getSecondsToNextPeriod(date) {
    const timeInSeconds = getPastSecondsOfDay(date);
    const id = getPeriodId(date, true);
    switch (id) {
        case PERIOD_ID.WORKING_DAY_ENDED: {
            return allDayLengthInSeconds - timeInSeconds + startNightShift; // счётчик до начала смены
        }
        case PERIOD_ID.WORKING_DAY: {
            return dayShiftLenght + startDayShift - timeInSeconds; // счётчик до конца смены
        }
        case PERIOD_ID.WORKING_NIGHT_PART_1: {
            return allDayLengthInSeconds - timeInSeconds + endNightShift; // счётчик до конца смены
        }
        case PERIOD_ID.BEFORE_WORKING_NIGHT: {
            return startNightShift - timeInSeconds; // счётчик до начала смены
        }
        case PERIOD_ID.WORKING_NIGHT_ENDED: {
            return allDayLengthInSeconds - timeInSeconds + allDayLengthInSeconds + startDayShift; // счётчик до начала смены
        }
        case PERIOD_ID.WORKING_NIGHT_PART_2: {
            return endNightShift - timeInSeconds; // счётчик до конца смены
        }
        case PERIOD_ID.DAY_OFF: {
            return allDayLengthInSeconds - timeInSeconds + startDayShift; // cчётчик до начала смены
        }
        case PERIOD_ID.BEFORE_WORKING_DAY: {
            return startDayShift - timeInSeconds; // счётчик до начала смены
        }
    }
}

export const getPeriodId = (date, currentDay = false) => {
    const timeInSeconds = getPastSecondsOfDay(date);
    const { isDayWorking, isNightWorking, isAfterWorkingNightDay } = getWorkingInfo(date);
    if (currentDay && isDayWorking && timeInSeconds >= endDayShift) {
        return PERIOD_ID.WORKING_DAY_ENDED;
    }
    if (currentDay && isDayWorking && timeInSeconds < startDayShift) {
        return PERIOD_ID.BEFORE_WORKING_DAY;
    }
    if (isDayWorking) {
        return PERIOD_ID.WORKING_DAY;
    }
    if (currentDay && isNightWorking && timeInSeconds < startNightShift) {
        return PERIOD_ID.BEFORE_WORKING_NIGHT;
    }
    if (isNightWorking) {
        return PERIOD_ID.WORKING_NIGHT_PART_1;
    }
    if (currentDay && isAfterWorkingNightDay && timeInSeconds >= endNightShift) {
        return PERIOD_ID.WORKING_NIGHT_ENDED;
    }
    if (isAfterWorkingNightDay) {
        return PERIOD_ID.WORKING_NIGHT_PART_2;
    }
    return PERIOD_ID.DAY_OFF;
};

function getPastSecondsOfDay(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const timeInSeconds = hours * 60 * 60 + minutes * 60 + seconds;
    return timeInSeconds;
}

export function parseSecondForTimer(secondsNumber) {
    const hours = Math.floor(secondsNumber / (60 * 60));
    const minutes = Math.floor((secondsNumber - hours * 60 * 60) / 60);
    const seconds = secondsNumber - (hours * 60 * 60 + minutes * 60);
    return [hours, minutes, seconds];
}
export function getStringTimerValue(secondsNumber) {
    const value = parseSecondForTimer(secondsNumber);
    return value.map((item) => padTo2Digits(item)).join(':');
}

export function getContentData(date, currentDay = false) {
    const worker = 'Пескарь';
    const beginOfMessage = `${currentDay ? 'Сегодня' : 'В этот день'} ${worker}`;
    const id = getPeriodId(date, currentDay);
    const endOfMessage = MESSAGES_MAP[id];

    return `${beginOfMessage} ${endOfMessage}`;
}

const SHIFT_PERIODS = [PERIOD_ID.WORKING_DAY, PERIOD_ID.WORKING_NIGHT_PART_1, PERIOD_ID.WORKING_NIGHT_PART_2];

export const isShiftContinue = (id) => {
    return SHIFT_PERIODS.includes(id);
};
