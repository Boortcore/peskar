import { getDayNumberSinceStartYear, padTo2Digits, formatDate } from './helpers';

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

// prettier-ignore
const scheduleInfo = [
    { name: 'дневная', value: [new Date(2022, 6, 20, 8, 0, 0, 0), new Date(2022, 6, 20, 20, 0, 0, 0)] },
    { name: 'ночная', value: [new Date(2022, 6, 21, 20, 0, 0, 0), new Date(2022, 6, 22, 8, 0, 0, 0)] },
    { name: 'выходной', value: [new Date(2022, 6, 23, 0, 0, 0, 0), new Date(2022, 6, 24, 0, 0, 0, 0)], dayOff: true }
];
const schedule = getShiftsInfo(scheduleInfo);

function getMessage(id, scheduleDay, currentDay) {
    const { beginShiftTime, endShiftTime, name, isShiftPart1 } = scheduleDay;
    const nextScheduleDay = getNexScheduleDay(schedule, scheduleDay);
    const beginMessageNotWhileShift = 'В этот день';
    const beginMessage = `${currentDay ? 'Идёт' : beginMessageNotWhileShift}`;
    const partMessage = nextScheduleDay.dayOff ? 'Следующий день - выходной.' : `Следующий день - ${nextScheduleDay.name} смена с ${getStringTimeBySeconds(nextScheduleDay.beginShiftTime, true)}.`;
    switch (id) {
        case PERIOD_ID.SHIFT_ENDED:
        case PERIOD_ID.SHIFT_PART_ENDED: {
            return `${name[0].toUpperCase() + name.slice(1)} смена ${currentDay ? 'завершилась' : 'завершается'} в ${getStringTimeBySeconds(endShiftTime, true)}. ${partMessage}`;
        }
        case PERIOD_ID.SHIFT:
        case PERIOD_ID.SHIFT_PART_1:
        case PERIOD_ID.SHIFT_PART_2: {
            return `${beginMessage} ${name} cмена с ${getStringTimeBySeconds(beginShiftTime, true)} до ${getStringTimeBySeconds(endShiftTime, true)} ${isShiftPart1 ? 'следующего дня.' : partMessage}`;
        }
        case PERIOD_ID.BEFORE_SHIFT:
        case PERIOD_ID.BEFORE_SHIFT_PART: {
            return `${beginMessageNotWhileShift} ${name} смена начнётся с ${getStringTimeBySeconds(beginShiftTime, true)} до ${getStringTimeBySeconds(endShiftTime, true)} ${isShiftPart1 ? 'следующего' : 'текущего'} дня.`;
        }
        case PERIOD_ID.DAY_OFF: {
            return `${beginMessageNotWhileShift} ${name}. ${partMessage}`;
        }
    }
}
function getStartDate(date, offset = 1) {
    const day = new Date(date.valueOf());
    day.setDate(day.getDate() + offset);
    day.setHours(0);
    day.setMinutes(0);
    day.setSeconds(0);
    return day;
}
function getScheduleDayWithTime(currentDay, scheduleDay) {
    const { hours, minutes, seconds } = getTimeOfDate(currentDay);
    const scheduleDateWithTime = new Date(scheduleDay.test.valueOf());
    scheduleDateWithTime.setHours(hours);
    scheduleDateWithTime.setMinutes(minutes);
    scheduleDateWithTime.setSeconds(seconds);
    return { ...scheduleDay, scheduleDateWithTime };
}
function getShiftsInfo(shiftList) {
    const days = new Map();
    let index = 0;
    shiftList.forEach(({ name, value: [begin, end], dayOff }) => {
        const numberDayOfBeginning = getDayNumberSinceStartYear(begin);
        const numberDayOfEnding = getDayNumberSinceStartYear(end);
        const beginShiftTime = getTimeInSeconds(begin);
        const endShiftTime = getTimeInSeconds(end);
        const hasAfewDays = numberDayOfBeginning !== numberDayOfEnding;
        const dayCount = numberDayOfEnding - numberDayOfBeginning + 1;
        const isPart = hasAfewDays && !dayOff;
        const dateOfDays = {
            0: begin,
            [dayCount - 1]: end,
        };

        for (let i = 0; i < dayCount; i++) {
            const dateOfDay = dateOfDays[i] || getStartDate(begin, i);
            days.set(formatDate(dateOfDay), {
                index: index++,
                begin,
                test: dateOfDay,
                end,
                name,
                isShiftPart: isPart,
                isShiftPart1: isPart && i !== dayCount - 1,
                isShiftPart2: isPart && i === dayCount - 1,
                dayOff,
                numberDay: getDayNumberSinceStartYear(dateOfDay),
                beginShiftTime,
                endShiftTime,
            });
        }
    });
    [...days.values()].forEach((day) => {
        const dayWithNextShift = getNexScheduleDay(days, day, (day) => !day.dayOff && !day.isShiftPart2);
        day.dayWithNextShift = dayWithNextShift.begin;
    });
    return days;
}

function getScheduleDayByDate(date) {
    const infoLength = schedule.size;
    const dayNumberSinceStartYear = getDayNumberSinceStartYear(date);
    const scheduleDay = [...schedule.values()].find((dayInfo) => (dayNumberSinceStartYear - dayInfo.numberDay) % infoLength === 0);
    return getScheduleDayWithTime(date, scheduleDay);
}

export const getPeriodId = (scheduleDay, currentDay = false) => {
    const { scheduleDateWithTime, end, begin, dayOff, isShiftPart1, isShiftPart2 } = scheduleDay;
    const beginShift = +begin / 1000;
    const endShift = +end / 1000;
    const currentTime = scheduleDateWithTime / 1000;

    if (currentDay && !dayOff && !isShiftPart1 && !isShiftPart2 && currentTime >= endShift) {
        return PERIOD_ID.SHIFT_ENDED;
    }
    if (currentDay && !dayOff && !isShiftPart1 && !isShiftPart2 && currentTime < beginShift) {
        return PERIOD_ID.BEFORE_SHIFT;
    }
    if (!isShiftPart1 && !isShiftPart2 && !dayOff) {
        return PERIOD_ID.SHIFT;
    }
    if (currentDay && isShiftPart1 && currentTime < beginShift) {
        return PERIOD_ID.BEFORE_SHIFT_PART;
    }
    if (isShiftPart1) {
        return PERIOD_ID.SHIFT_PART_1;
    }
    if (currentDay && isShiftPart2 && currentTime >= endShift) {
        return PERIOD_ID.SHIFT_PART_ENDED;
    }
    if (isShiftPart2) {
        return PERIOD_ID.SHIFT_PART_2;
    }
    return PERIOD_ID.DAY_OFF;
};

function getTimerValue(id, scheduleDay) {
    const { dayWithNextShift, scheduleDateWithTime, end, begin } = scheduleDay;
    const beginShift = +begin / 1000;
    const endShift = +end / 1000;
    const currentTime = scheduleDateWithTime / 1000;
    const nextShiftBegin = dayWithNextShift / 1000;
    switch (id) {
        case PERIOD_ID.SHIFT_ENDED:
        case PERIOD_ID.SHIFT_PART_ENDED:
        case PERIOD_ID.DAY_OFF: {
            return nextShiftBegin - currentTime; // счётчик до начала смены
        }
        case PERIOD_ID.BEFORE_SHIFT:
        case PERIOD_ID.BEFORE_SHIFT_PART: {
            return beginShift - currentTime; // счётчик до начала смены
        }

        case PERIOD_ID.SHIFT:
        case PERIOD_ID.SHIFT_PART_1:
        case PERIOD_ID.SHIFT_PART_2: {
            return endShift - currentTime; // счётчик до конца смены
        }
    }
}

function getTimeOfDate(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return { hours, minutes, seconds };
}

function getTimeInSeconds(date) {
    const { hours, minutes, seconds } = getTimeOfDate(date);
    const timeInSeconds = hours * 60 * 60 + minutes * 60 + seconds;
    return timeInSeconds;
}

export function parseSecondForTimer(secondsNumber, withoutSeconds) {
    const hours = Math.floor(secondsNumber / (60 * 60));
    const minutes = Math.floor((secondsNumber - hours * 60 * 60) / 60);
    const seconds = !withoutSeconds ? secondsNumber - (hours * 60 * 60 + minutes * 60) : 0;
    return [hours, minutes].concat(!withoutSeconds ? seconds : []);
}

export function getStringTimeBySeconds(secondsNumber, withoutSeconds = false) {
    const value = parseSecondForTimer(secondsNumber, withoutSeconds);
    return value.map((item) => padTo2Digits(item)).join(':');
}

// function getNexScheduleDay(schedule, scheduleDay, withDayOff = false) {
function getNexScheduleDay(schedule, scheduleDay, callback) {
    const list = [...schedule.values()];
    let index = scheduleDay.index;
    while (true) {
        if (index === list.length) index = -1;
        const nextScheduleDay = list[++index];
        if (nextScheduleDay && (!callback || !nextScheduleDay.dayOff)) {
            if (scheduleDay.begin > nextScheduleDay.begin) {
                const begin = new Date(+nextScheduleDay.begin);
                const end = new Date(+nextScheduleDay.end);
                begin.setDate(begin.getDate() + list.length);
                end.setDate(end.getDate() + list.length);
                return { ...nextScheduleDay, begin, end };
            }
            return nextScheduleDay;
        }
    }
}

export function getTimerValueByDate(date, currentDay) {
    const scheduleDay = getScheduleDayByDate(date);
    const id = getPeriodId(scheduleDay, currentDay);
    const timerValue = getTimerValue(id, scheduleDay);
    return timerValue;
}

export function getPeriodIdByDate(date, currentDay) {
    const scheduleDay = getScheduleDayByDate(date);
    const id = getPeriodId(scheduleDay, currentDay);
    return id;
}

export function getContentData(date, currentDay = false) {
    const worker = 'Пескарь';
    const scheduleDay = getScheduleDayByDate(date);
    const id = getPeriodId(scheduleDay, currentDay);

    return getMessage(id, scheduleDay, currentDay);
}

const SHIFT_PERIODS = [PERIOD_ID.SHIFT, PERIOD_ID.SHIFT_PART_1, PERIOD_ID.SHIFT_PART_2];

export const isShiftContinue = (id) => {
    return SHIFT_PERIODS.includes(id);
};
