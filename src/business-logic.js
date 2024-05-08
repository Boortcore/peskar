import { getDayNumberOfYear } from './helpers';

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

// export const getContentData = (date) => {
//     const { isDayWorking, isNightWorking, isFirstDayOff } = getWorkingInfo(date);
//     const text = 'У Пескаря в этот день';

//     if (isDayWorking) {
//         return text + ' дневная смена. Завтра в ночь, потом два выходных.';
//     } else if (isNightWorking) {
//         return text + ' ночная смена. Потом два выходных.';
//     } else if (isFirstDayOff) {
//         return text + ' первый выходной. Завтра ещё один.';
//     } else {
//         return text + ' второй выходной. Завтра в день на работу.';
//     }
// };

const allDayLengthInSeconds = 24 * 60 * 60;
const startDayShift = 8 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const dayShiftLenght = 12 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const endDayShift = 20 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const startNightShift = 20 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const endNightShift = 8 /* hours */ * 60 /* minutes */ * 60; /* seconds */
export const getContentData2 = (date) => {
    const { isDayWorking, isNightWorking, isFirstDayOff } = getWorkingInfo(date);
    const text = 'У Пескаря в этот день';

    if (isDayWorking) {
        return text + ' дневная смена. Завтра в ночь, потом два выходных.';
    } else if (isNightWorking) {
        return text + ' ночная смена. Потом два выходных.';
    } else if (isFirstDayOff) {
        return text + ' первый выходной. Завтра ещё один.';
    } else {
        return text + ' второй выходной. Завтра в день на работу.';
    }
};

function getSecondsToNextPeriod(date) {
    const timeInSeconds = getPastSecondsOfDay(date);
    const id = getPeriodId(date, true);
    switch (id) {
        case PERIOD_ID.WORKING_DAY_ENDED: {
            return allDayLengthInSeconds - timeInSeconds + startNightShift; // счётчик до начала смены
            //  return allDayLengthInSeconds - timeInSeconds + startNightShift;
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
            return allDayLengthInSeconds - timeInSeconds + startNightShift; // cчётчик до начала смены
        }
    }
}

// const PERIOD_IDS = {
//     0: 'WORKING_DAY_ENDED',
//     1: 'WORKING_DAY',
//     2: 'WORKING_NIGHT_PART_1',
//     3: 'BEFORE_WORKING_NIGHT',
//     4: 'WORKING_NIGHT_ENDED',
//     5: 'WORKING_NIGHT_PART_2',
//     6: 'DAY_OFF',
// };

const PERIOD_ID = {
    WORKING_DAY_ENDED: 0,
    WORKING_DAY: 1,
    WORKING_NIGHT_PART_1: 2,
    BEFORE_WORKING_NIGHT: 3,
    WORKING_NIGHT_ENDED: 4,
    WORKING_NIGHT_PART_2: 5,
    DAY_OFF: 6,
};

const getPeriodId = (date, considerTime) => {
    const timeInSeconds = getPastSecondsOfDay(date);
    const { isDayWorking, isNightWorking, isAfterWorkingNightDay } = getWorkingInfo(date);
    if (considerTime && isDayWorking && timeInSeconds > endDayShift) {
        return PERIOD_ID.WORKING_DAY_ENDED;
    }
    if (isDayWorking) {
        return PERIOD_ID.WORKING_DAY;
    }
    if (considerTime && isNightWorking && timeInSeconds > startNightShift) {
        return PERIOD_ID.WORKING_NIGHT_PART_1;
    }
    if (isNightWorking) {
        return PERIOD_ID.BEFORE_WORKING_NIGHT;
    }
    if (considerTime && isAfterWorkingNightDay && timeInSeconds > endNightShift) {
        return PERIOD_ID.WORKING_NIGHT_ENDED;
    }
    if (isAfterWorkingNightDay) {
        return PERIOD_ID.WORKING_NIGHT_PART_2;
    }
    return PERIOD_ID.DAY_OFF;
};

const MESSAGES_MAP = {
    [PERIOD_ID.WORKING_DAY_ENDED]: 'завершил дневную смену в 20:00. Следующий день - ночная смена с 20:00.',
    [PERIOD_ID.WORKING_DAY]: 'в дневной смене с 8:00 до 20:00. Следущий день - ночная смена с 20:00.',
    [PERIOD_ID.WORKING_NIGHT_PART_1]: 'в ночной смене с 20:00 до 8:00 следующего дня.',
    [PERIOD_ID.BEFORE_WORKING_NIGHT]: 'выходит в ночную смену с 20:00 до 8:00 следующего дня.',
    [PERIOD_ID.WORKING_NIGHT_ENDED]: 'завершил ночную смену в 8:00. Следующий день - выходной.',
    [PERIOD_ID.WORKING_NIGHT_PART_2]: 'в ночной смене до 8:00. Следующий день - выходной.',
    [PERIOD_ID.DAY_OFF]: 'отдыхает. Следующий день - дневная смена в 8:00.',
};

function getPastSecondsOfDay(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const timeInSeconds = hours * 60 * 60 + minutes * 60 + seconds;
    return timeInSeconds;
}

export function getContentData(date, considerTime = false) {
    const worker = 'Пескарь';
    const beginOfMessage = `${considerTime ? 'Сегодня' : 'В этот день'} ${worker}`;
    const id = getPeriodId(date, considerTime);
    const endOfMessage = MESSAGES_MAP[id];
    console.log(getSecondsToNextPeriod(date) / 60 / 60);
    return `${beginOfMessage} ${endOfMessage}`;
}
