import { getDayNumberSinceStartYear, padTo2Digits, formatDate } from './helpers';
const allDayLengthInSeconds = 24 * 60 * 60;

export const PERIOD_ID = {
    SHIFT_ENDED: 0,
    SHIFT: 1,
    SHIFT_PART_1: 2,
    BEFORE_SHIFT_PART: 3,
    SHIFT_PART_ENDED: 4,
    SHIFT_PART_2: 5,
    DAY_OFF: 6,
    BEFORE_SHIFT: 7,
};

export const MESSAGES_MAP = {
    [PERIOD_ID.SHIFT_ENDED]: 'завершил дневную смену в 20:00. Следующий день - ночная смена с 20:00.',
    [PERIOD_ID.SHIFT]: 'в дневной смене с 8:00 до 20:00. Следущий день - ночная смена с 20:00.',
    [PERIOD_ID.SHIFT_PART_1]: 'в ночной смене с 20:00 до 8:00 следующего дня.',
    [PERIOD_ID.BEFORE_SHIFT_PART]: 'выходит в ночную смену с 20:00 до 8:00 следующего дня.',
    [PERIOD_ID.SHIFT_PART_ENDED]: 'завершил ночную смену в 8:00. Следующий день - выходной.',
    [PERIOD_ID.SHIFT_PART_2]: 'в ночной смене до 8:00. Следующий день - выходной.',
    [PERIOD_ID.DAY_OFF]: 'отдыхает. Следующий день - дневная смена в 8:00.',
    [PERIOD_ID.BEFORE_SHIFT]: 'выходит в дневную смену с 08:00 до 20:00. Следующий день - ночная смена с 20:00',
};

// prettier-ignore
const schedule = [
    { name: 'дневная', value: [new Date(2022, 6, 20, 8, 0, 0, 0), new Date(2022, 6, 20, 20, 0, 0, 0)] },
    { name: 'ночная', value: [new Date(2022, 6, 21, 20, 0, 0, 0), new Date(2022, 6, 22, 8, 0, 0, 0)] },
    { name: 'выходной', value: [new Date(2022, 6, 23, 0, 0, 0, 0), new Date(2022, 6, 23, 0, 0, 0, 0)], dayOff: true }
];

function getShiftsInfo(shiftList) {
    const days = new Map();
    shiftList.forEach(({ name, value: [begin, end], dayOff }) => {
        const numberDayOfBeginning = getDayNumberSinceStartYear(begin);
        const numberDayOfEnding = getDayNumberSinceStartYear(end);
        const beginShiftTime = getSecondsOfDay(begin);
        const endShiftTime = getSecondsOfDay(end);
        const hasAfewDays = numberDayOfBeginning !== numberDayOfEnding;
        const isDayOff = endShiftTime - beginShiftTime === 0 || dayOff;
        days.set(formatDate(begin), {
            begin,
            end,
            name,
            length: (end - begin) / 1000,
            isShiftPart1: hasAfewDays,
            isDayOff,
            numberDay: numberDayOfBeginning,
            beginShiftTime,
            endShiftTime,
        });
        if (hasAfewDays) {
            days.set(formatDate(end), {
                begin,
                end,
                length: (end - begin) / 1000,
                name,
                isShiftPart2: hasAfewDays,
                numberDay: numberDayOfEnding,
                beginShiftTime,
                endShiftTime,
                isDayOff,
            });
        }
    });
    return days;
}
const shistsInfo = getShiftsInfo(schedule);

function getShiftInfo(date) {
    const infoLength = shistsInfo.size;
    const dayNumberSinceStartYear = getDayNumberSinceStartYear(date);
    return [...shistsInfo.values()].find((dayInfo) => (dayNumberSinceStartYear - dayInfo.numberDay) % infoLength === 0);
}

export const getPeriodId = (timeInSeconds, shiftInfo, currentDay = false) => {
    const { beginShiftTime, endShiftTime, isDayOff, isShiftPart1, isShiftPart2 } = shiftInfo;
    if (currentDay && !isDayOff && !isShiftPart1 && !isShiftPart2 && timeInSeconds >= endShiftTime) {
        return PERIOD_ID.SHIFT_ENDED;
    }
    if (currentDay && !isDayOff && !isShiftPart1 && !isShiftPart2 && timeInSeconds < beginShiftTime) {
        return PERIOD_ID.BEFORE_SHIFT;
    }
    if (!isShiftPart1 && !isShiftPart2 && !isDayOff) {
        return PERIOD_ID.SHIFT;
    }
    if (currentDay && isShiftPart1 && timeInSeconds < beginShiftTime) {
        return PERIOD_ID.BEFORE_SHIFT_PART;
    }
    if (isShiftPart1) {
        return PERIOD_ID.SHIFT_PART_1;
    }
    if (currentDay && isShiftPart2 && timeInSeconds >= endShiftTime) {
        return PERIOD_ID.SHIFT_PART_ENDED;
    }
    if (isShiftPart2) {
        return PERIOD_ID.SHIFT_PART_2;
    }
    return PERIOD_ID.DAY_OFF;
};

function getTimerValue(id, timeInSeconds, shiftInfo, nextShiftInfo) {
    const { beginShiftTime, endShiftTime } = shiftInfo;
    const timeToNextShift = Math.abs(nextShiftInfo.begin - shiftInfo.end) / 1000;

    switch (id) {
        case PERIOD_ID.SHIFT_ENDED: {
            return timeToNextShift - (timeInSeconds - beginShiftTime); // счётчик до начала смены
        }
        case PERIOD_ID.SHIFT: {
            return endShiftTime - timeInSeconds; // счётчик до конца смены
        }
        case PERIOD_ID.SHIFT_PART_1: {
            return allDayLengthInSeconds - timeInSeconds + endShiftTime; // счётчик до конца смены
        }
        case PERIOD_ID.BEFORE_SHIFT_PART: {
            return beginShiftTime - timeInSeconds; // счётчик до начала смены
        }
        case PERIOD_ID.SHIFT_PART_ENDED: {
            return timeToNextShift - (timeInSeconds - endShiftTime); // счётчик до начала смены
        }
        case PERIOD_ID.SHIFT_PART_2: {
            return endShiftTime - timeInSeconds; // счётчик до конца смены
        }
        case PERIOD_ID.DAY_OFF: {
            return allDayLengthInSeconds - timeInSeconds + nextShiftInfo.beginShiftTime; // cчётчик до начала смены
        }
        case PERIOD_ID.BEFORE_SHIFT: {
            return beginShiftTime - timeInSeconds; // счётчик до начала смены
        }
    }
}

function getTimeOfDate(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return { hours, minutes, seconds };
}

function getSecondsOfDay(date) {
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

export function getStringTimeBySeconds(secondsNumber) {
    const value = parseSecondForTimer(secondsNumber);
    return value.map((item) => padTo2Digits(item)).join(':');
}

function getNextShift(shiftInfo) {
    const list = [...shistsInfo.values()];
    let index = list.indexOf(shiftInfo);

    while (true) {
        if (index === list.length) index = -1;
        const nextShiftInfo = list[++index];
        if (nextShiftInfo && !nextShiftInfo.isDayOff) {
            return nextShiftInfo;
        }
    }
}

export function getTimerValueByDate(date, currentDay) {
    const timeInSeconds = getSecondsOfDay(date);
    const shiftInfo = getShiftInfo(date);
    const nextShiftInfo = getNextShift(shiftInfo);
    const id = getPeriodId(timeInSeconds, shiftInfo, currentDay);
    const timerValue = getTimerValue(id, timeInSeconds, shiftInfo, nextShiftInfo);
    return timerValue;
}

export function getPeriodIdByDate(date, currentDay) {
    const timeInSeconds = getSecondsOfDay(date);
    const shiftInfo = getShiftInfo(date);
    const id = getPeriodId(timeInSeconds, shiftInfo, currentDay);
    return id;
}

export function getContentData(date, currentDay = false) {
    const worker = 'Пескарь';
    const timeInSeconds = getSecondsOfDay(date);
    const shiftInfo = getShiftInfo(date);
    const id = getPeriodId(timeInSeconds, shiftInfo, currentDay);
    const beginOfMessage = `${currentDay ? 'Сегодня' : 'В этот день'} `;
    const endOfMessage = MESSAGES_MAP[id];
    return `${beginOfMessage} ${endOfMessage}`;
}

const SHIFT_PERIODS = [PERIOD_ID.SHIFT, PERIOD_ID.SHIFT_PART_1, PERIOD_ID.SHIFT_PART_2];

export const isShiftContinue = (id) => {
    return SHIFT_PERIODS.includes(id);
};
