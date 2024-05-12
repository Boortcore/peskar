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
    [PERIOD_ID.DAY_OFF]: 'отдыхает. Следующий день - дневная смена c 8:00.',
    [PERIOD_ID.BEFORE_SHIFT]: 'выходит в дневную смену с 08:00 до 20:00. Следующий день - ночная смена с 20:00',
};

// prettier-ignore
const scheduleInfo = [
    { name: 'дневная', value: [new Date(2022, 6, 20, 8, 0, 0, 0), new Date(2022, 6, 20, 20, 0, 0, 0)] },
    { name: 'ночная', value: [new Date(2022, 6, 21, 20, 0, 0, 0), new Date(2022, 6, 22, 8, 0, 0, 0)] },
    { name: 'выходной', value: [new Date(2022, 6, 23, 0, 0, 0, 0), new Date(2022, 6, 24, 0, 0, 0, 0)], dayOff: true }
];
const schedule = getShiftsInfo(scheduleInfo);
function getMessage(id, scheduleDay, currentDay) {
    const { beginShiftTime, endShiftTime, name } = scheduleDay;
    const nextScheduleDay = getNexScheduletDay(schedule, scheduleDay, true);
    const beginMessageNotWhileShift = 'В этот день';
    const beginMessage = `${currentDay ? 'Идёт' : beginMessageNotWhileShift}`;
    const partMessage = nextScheduleDay.dayOff ? 'Следующий день - выходной.' : `Следующий день - ${nextScheduleDay.name} смена с ${getStringTimeBySeconds(nextScheduleDay.beginShiftTime, true)}.`;
    switch (id) {
        case PERIOD_ID.SHIFT_ENDED:
        case PERIOD_ID.SHIFT_PART_ENDED: {
            return `${name[0].toUpperCase() + name.slice(1)} смена ${currentDay ? 'завершилась' : 'завершается'} в ${getStringTimeBySeconds(endShiftTime, true)}. ${partMessage}`;
        }
        case PERIOD_ID.SHIFT: {
            return `${beginMessage} ${name} cмена с ${getStringTimeBySeconds(beginShiftTime, true)}. ${partMessage}`;
        }
        case PERIOD_ID.SHIFT_PART_1: {
            return `${beginMessage} ${name} cмена с ${getStringTimeBySeconds(beginShiftTime, true)} до ${getStringTimeBySeconds(endShiftTime, true)} следующего дня.`;
        }
        case PERIOD_ID.BEFORE_SHIFT_PART: {
            return `${beginMessageNotWhileShift} ${name} смена начнётся с ${getStringTimeBySeconds(beginShiftTime, true)} до ${getStringTimeBySeconds(endShiftTime)} следующего дня.`;
        }
        // case PERIOD_ID.SHIFT_PART_ENDED: {
        //     return `${name} смена завершена в ${getStringTimeBySeconds(endShiftTime, true)} ${partMessage}`;
        // }
        case PERIOD_ID.SHIFT_PART_2: {
            return `${beginMessage} ${name} cмена до ${getStringTimeBySeconds(endShiftTime, true)}. ${partMessage}`;
        }
        case PERIOD_ID.DAY_OFF: {
            return `${beginMessageNotWhileShift} ${name}. ${partMessage}`;
        }
        case PERIOD_ID.BEFORE_SHIFT: {
            return `${beginMessageNotWhileShift} ${name} смена начнётся с ${getStringTimeBySeconds(beginShiftTime, true)} до ${getStringTimeBySeconds(endShiftTime, true)}.`;
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
function getSchedyleDayWithTime(currentDay, scheduleDay) {
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
        const dayCount = numberDayOfEnding - numberDayOfBeginning - 1;
        const isPart = hasAfewDays && !dayOff;
        days.set(formatDate(begin), {
            index: index++,
            begin,
            end,
            test: begin,
            name,
            length: (end - begin) / 1000,
            isShiftPart1: isPart,
            dayOff,
            numberDay: numberDayOfBeginning,
            beginShiftTime,
            endShiftTime,
        });
        for (let i = 0; i < dayCount; i++) {
            const nextDate = getStartDate(begin, i + 1);
            days.set(formatDate(nextDate), {
                index: index,
                begin,
                test: nextDate,
                end,
                name,
                length: (end - begin) / 1000,
                isShiftPart1: isPart,
                dayOff,
                numberDay: getDayNumberSinceStartYear(nextDate),
                beginShiftTime,
                endShiftTime,
            });
        }
        if (hasAfewDays) {
            days.set(formatDate(end), {
                index: index++,
                begin,
                end,
                test: end,
                length: (end - begin) / 1000,
                name,
                isShiftPart2: isPart,
                numberDay: numberDayOfEnding,
                beginShiftTime,
                endShiftTime,
                dayOff,
            });
        }
    });
    [...days.values()].forEach((day) => {
        const { end } = day;
        let nextDay = getNexScheduletDay(days, day);
        const dayWithNextShift = nextDay.isShiftPart2 ? getNexScheduletDay(days, nextDay) : nextDay;
        day.nextBegin = dayWithNextShift.begin;
        day.timeToNextShift = (dayWithNextShift.begin - end) / 1000;
        // day.timeToNextShift = (dayWithNextShift.begin - end) / 1000;
    });
    return days;
}

function getScheduleDayByDate(date) {
    const infoLength = schedule.size;
    const dayNumberSinceStartYear = getDayNumberSinceStartYear(date);
    const scheduleDay = [...schedule.values()].find((dayInfo) => {
        return (dayNumberSinceStartYear - dayInfo.numberDay) % infoLength === 0;
    });
    return getSchedyleDayWithTime(date, scheduleDay);
}

export const getPeriodId = (timeInSeconds, shiftInfo, currentDay = false) => {
    const { beginShiftTime, endShiftTime, dayOff, isShiftPart1, isShiftPart2 } = shiftInfo;
    if (currentDay && !dayOff && !isShiftPart1 && !isShiftPart2 && timeInSeconds >= endShiftTime) {
        return PERIOD_ID.SHIFT_ENDED;
    }
    if (currentDay && !dayOff && !isShiftPart1 && !isShiftPart2 && timeInSeconds < beginShiftTime) {
        return PERIOD_ID.BEFORE_SHIFT;
    }
    if (!isShiftPart1 && !isShiftPart2 && !dayOff) {
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

function getTimerValue(id, timeInSeconds, scheduleDay, nextScheduleDay) {
    const { nextBegin, scheduleDateWithTime, end, begin } = scheduleDay;
    const beginShift = +begin / 1000;
    const endShift = +end / 1000;
    const currentTime = scheduleDateWithTime / 1000;
    const nextShiftBegin = nextBegin / 1000;
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
        case PERIOD_ID.SHIFT_PART_2:
        case PERIOD_ID.SHIFT_PART_1: {
            return endShift - currentTime; // счётчик до конца смены
        }
    }
}

// function getTimerValue(id, timeInSeconds, scheduleDay, nextScheduleDay) {
//     const { beginShiftTime, endShiftTime, timeToNextShift, length } = scheduleDay;

//     switch (id) {
//         case PERIOD_ID.SHIFT_ENDED:
//         case PERIOD_ID.SHIFT_PART_ENDED:
//         case PERIOD_ID.DAY_OFF: {
//             return timeToNextShift - (timeInSeconds - endShiftTime); // счётчик до начала смены
//         }
//         case PERIOD_ID.SHIFT_PART_1: {
//             return length - (timeInSeconds - beginShiftTime); // счётчик до конца смены // подумать как свести к одному выражению.
//         }
//         case PERIOD_ID.BEFORE_SHIFT:
//         case PERIOD_ID.BEFORE_SHIFT_PART: {
//             return beginShiftTime - timeInSeconds; // счётчик до начала смены
//         }
//         // case PERIOD_ID.SHIFT_PART_ENDED: {
//         //     return timeToNextShift - (timeInSeconds - endShiftTime); // счётчик до начала смены
//         // }
//         case PERIOD_ID.SHIFT:
//         case PERIOD_ID.SHIFT_PART_2: {
//             return endShiftTime - timeInSeconds; // счётчик до конца смены
//         }
//         // case PERIOD_ID.DAY_OFF: {
//         //     return timeToNextShift - (timeInSeconds - endShiftTime); // cчётчик до начала смены
//         // }
//         // case PERIOD_ID.BEFORE_SHIFT: {
//         //     return beginShiftTime - timeInSeconds; // счётчик до начала смены
//         // }
//     }
// }

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

function getScheduleDayIndex(schedule, day) {
    const list = [...schedule.values()];
    const index = list.indexOf(day);
    return index;
}

function getNexScheduletDay(schedule, scheduleDay, withDayOff = false) {
    const list = [...schedule.values()];
    let index = scheduleDay.index;
    while (true) {
        if (index === list.length) index = -1;
        const nextScheduleDay = list[++index];
        if (nextScheduleDay && (withDayOff || !nextScheduleDay.dayOff)) {
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
    const timeInSeconds = getTimeInSeconds(date);
    const scheduleDay = getScheduleDayByDate(date);
    const nextScheduleDay = getNexScheduletDay(schedule, scheduleDay);
    const id = getPeriodId(timeInSeconds, scheduleDay, currentDay);
    const timerValue = getTimerValue(id, timeInSeconds, scheduleDay, nextScheduleDay);
    return timerValue;
}

export function getPeriodIdByDate(date, currentDay) {
    const timeInSeconds = getTimeInSeconds(date);
    const scheduleDay = getScheduleDayByDate(date);
    const id = getPeriodId(timeInSeconds, scheduleDay, currentDay);
    return id;
}

export function getContentData(date, currentDay = false) {
    const worker = 'Пескарь';
    const timeInSeconds = getTimeInSeconds(date);
    const scheduleDay = getScheduleDayByDate(date);
    const id = getPeriodId(timeInSeconds, scheduleDay, currentDay);
    console.log(getTimerValue(id, timeInSeconds, scheduleDay, getNexScheduletDay(schedule, scheduleDay)));
    return getMessage(id, scheduleDay, currentDay);
}

const SHIFT_PERIODS = [PERIOD_ID.SHIFT, PERIOD_ID.SHIFT_PART_1, PERIOD_ID.SHIFT_PART_2];

export const isShiftContinue = (id) => {
    return SHIFT_PERIODS.includes(id);
};
