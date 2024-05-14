import { getDayNumberSinceStartYear, padTo2Digits, formatDate } from './helpers';
import * as CONSTANTS from './constants';

const { PERIOD_ID, MESSAGES_MAP } = CONSTANTS;
const workingNightNumber = getDayNumberSinceStartYear(new Date(2022, 6, 21, 0, 0, 0, 0));
const workingDayNumber = getDayNumberSinceStartYear(new Date(2022, 6, 20, 0, 0, 0, 0));
const daySummary = 4;

const allDayLengthInSeconds = 24 * 60 * 60;
const startDayShift = 8 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const dayShiftLenght = 12 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const endDayShift = 20 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const startNightShift = 20 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const endNightShift = 8 /* hours */ * 60 /* minutes */ * 60; /* seconds */

// prettier-ignore
const schedule = [
    [new Date(2022, 6, 20, 8, 0, 0, 0), new Date(2022, 6, 20, 20, 0, 0, 0)],
    [new Date(2022, 6, 21, 21, 0, 0, 0), new Date(2022, 6, 22, 8, 0, 0, 0)],
    [new Date(2022, 6, 23, 0, 0, 0, 0), new Date(2022, 6, 23, 0, 0, 0, 0)]
];

function getShiftsInfo(shiftList) {
    const days = new Map();
    let dayIndex = 0;
    shiftList.forEach(([begin, end]) => {
        const numberDayOfBeginning = getDayNumberSinceStartYear(begin);
        const numberDayOfEnding = getDayNumberSinceStartYear(end);
        // const beginShiftDate = begin.getDate();
        // const endShiftDay = end.getDate();
        const beginShiftTime = getPastSecondsOfDay(begin);
        const endShiftTime = getPastSecondsOfDay(end);
        const hasAfewDays = numberDayOfBeginning !== numberDayOfEnding;
        const isDayOff = endShiftTime - beginShiftTime === 0;
        days.set(formatDate(begin), {
            dayIndex: dayIndex++,
            isWorkingNight1: hasAfewDays,
            isDayOff,
            numberDay: numberDayOfBeginning,
            beginShiftTime,
            endShiftTime,
            hasAfewDays,
        });
        if (hasAfewDays) {
            days.set(formatDate(end), {
                dayIndex: dayIndex++,
                isWorkingNight2: hasAfewDays,
                numberDay: numberDayOfEnding,
                beginShiftTime,
                endShiftTime,
            });
        }
        return days;
    });
    console.log(days);
    return days;
}
const shistsInfo = getShiftsInfo(schedule);

function getShiftInfo(date) {
    const infoLength = shistsInfo.size;
    const dayNumberSinceStartYear = getDayNumberSinceStartYear(date);
    const t = shistsInfo.values().find((dayInfo) => (dayNumberSinceStartYear - dayInfo.numberDay) % infoLength === 0);
    return t;
}

export const getPeriodId = (date, currentDay = false) => {
    const timeInSeconds = getPastSecondsOfDay(date);
    const { beginShiftTime, endShiftTime, hasAfewDays, isDayOff, isWorkingNight1, isWorkingNight2 } = getShiftInfo(date);
    console.log(getShiftInfo(date));
    if (currentDay && !isDayOff && !hasAfewDays && timeInSeconds >= endShiftTime) {
        return PERIOD_ID.WORKING_DAY_ENDED;
    }
    if (currentDay && !isDayOff && !hasAfewDays && timeInSeconds < beginShiftTime) {
        return PERIOD_ID.BEFORE_WORKING_DAY;
    }
    if (!hasAfewDays && !isDayOff) {
        return PERIOD_ID.WORKING_DAY;
    }
    if (currentDay && (isWorkingNight1 || isWorkingNight2) && timeInSeconds < startNightShift) {
        return PERIOD_ID.BEFORE_WORKING_NIGHT;
    }
    if (isWorkingNight1) {
        return PERIOD_ID.WORKING_NIGHT_PART_1;
    }
    if (currentDay && isAfterWorkingNightDay && timeInSeconds >= endNightShift) {
        return PERIOD_ID.WORKING_NIGHT_ENDED;
    }
    if (isWorkingNight2) {
        return PERIOD_ID.WORKING_NIGHT_PART_2;
    }
    return PERIOD_ID.DAY_OFF;
};

getPeriodId(new Date(2024, 4, 11, 8, 0, 0, 0), true);
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
    const chosenDay = getDayNumberSinceStartYear(date);
    return {
        isDayWorking: isDayWorking(chosenDay),
        isNightWorking: isNightWorking(chosenDay),
        isAfterWorkingNightDay: isAfterWorkingNightDay(chosenDay),
    };
};

// export function getSecondsToNextPeriod(date) {
//     const timeInSeconds = getPastSecondsOfDay(date);
//     const id = getPeriodId(date, true);
//     switch (id) {
//         case PERIOD_ID.WORKING_DAY_ENDED: {
//             return allDayLengthInSeconds - timeInSeconds + startNightShift; // счётчик до начала смены
//         }
//         case PERIOD_ID.WORKING_DAY: {
//             return dayShiftLenght + startDayShift - timeInSeconds; // счётчик до конца смены
//         }
//         case PERIOD_ID.WORKING_NIGHT_PART_1: {
//             return allDayLengthInSeconds - timeInSeconds + endNightShift; // счётчик до конца смены
//         }
//         case PERIOD_ID.BEFORE_WORKING_NIGHT: {
//             return startNightShift - timeInSeconds; // счётчик до начала смены
//         }
//         case PERIOD_ID.WORKING_NIGHT_ENDED: {
//             return allDayLengthInSeconds - timeInSeconds + allDayLengthInSeconds + startDayShift; // счётчик до начала смены
//         }
//         case PERIOD_ID.WORKING_NIGHT_PART_2: {
//             return endNightShift - timeInSeconds; // счётчик до конца смены
//         }
//         case PERIOD_ID.DAY_OFF: {
//             return allDayLengthInSeconds - timeInSeconds + startDayShift; // cчётчик до начала смены
//         }
//         case PERIOD_ID.BEFORE_WORKING_DAY: {
//             return startDayShift - timeInSeconds; // счётчик до начала смены
//         }
//     }
// }

// export const getPeriodId = (date, currentDay = false) => {
//     const timeInSeconds = getPastSecondsOfDay(date);
//     const { isDayWorking, isNightWorking, isAfterWorkingNightDay } = getWorkingInfo(date);
//     if (currentDay && isDayWorking && timeInSeconds >= endDayShift) {
//         return PERIOD_ID.WORKING_DAY_ENDED;
//     }
//     if (currentDay && isDayWorking && timeInSeconds < startDayShift) {
//         return PERIOD_ID.BEFORE_WORKING_DAY;
//     }
//     if (isDayWorking) {
//         return PERIOD_ID.WORKING_DAY;
//     }
//     if (currentDay && isNightWorking && timeInSeconds < startNightShift) {
//         return PERIOD_ID.BEFORE_WORKING_NIGHT;
//     }
//     if (isNightWorking) {
//         return PERIOD_ID.WORKING_NIGHT_PART_1;
//     }
//     if (currentDay && isAfterWorkingNightDay && timeInSeconds >= endNightShift) {
//         return PERIOD_ID.WORKING_NIGHT_ENDED;
//     }
//     if (isAfterWorkingNightDay) {
//         return PERIOD_ID.WORKING_NIGHT_PART_2;
//     }
//     return PERIOD_ID.DAY_OFF;
// };

function getTimeOfDate(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return { hours, minutes, seconds };
}
function getPastSecondsOfDay(date) {
    const { hours, minutes, seconds } = getTimeOfDate(date);
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
