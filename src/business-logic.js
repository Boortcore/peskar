import { getDayNumberSinceStartYear, padTo2Digits, formatDate } from './helpers';

export const PERIOD_ID = {
    SHIFT: 0,
    SHIFT_ENDED: 1,
    DAY_OFF: 2,
    BEFORE_SHIFT: 3,
};

// prettier-ignore
const scheduleInfo = [
    { name: 'дневная', value: [new Date(2022, 6, 20, 8, 0, 0, 0), new Date(2022, 6, 20, 20, 0, 0, 0)] },
    { name: 'ночная', value: [new Date(2022, 6, 21, 20, 0, 0, 0), new Date(2022, 6, 22, 8, 0, 0, 0)] },
    { name: 'выходной', value: [new Date(2022, 6, 23, 0, 0, 0, 0), new Date(2022, 6, 23, 0, 0, 0, 0)], dayOff: true }
];
const schedule = getShiftsInfo(scheduleInfo);

function getMessage(id, scheduleDay, currentDay) {
    const { beginShiftTime, endShiftTime, name, isShiftPart } = scheduleDay;
    const nextScheduleDay = getNexScheduleDay(scheduleDay);
    const beginMessageNotWhileShift = 'В этот день';
    const beginMessage = `${currentDay ? 'Идёт' : beginMessageNotWhileShift}`;
    const partMessage = nextScheduleDay.dayOff ? 'Следующий день - выходной.' : `Следующий день - ${nextScheduleDay.name} смена с ${nextScheduleDay.beginShiftTime}.`;
    switch (id) {
        case PERIOD_ID.SHIFT_ENDED: {
            return `${name[0].toUpperCase() + name.slice(1)} смена ${currentDay ? 'завершилась' : 'завершается'} в ${endShiftTime}. ${partMessage}`;
        }
        case PERIOD_ID.SHIFT: {
            return `${beginMessage} ${name} cмена с ${beginShiftTime} до ${endShiftTime}${isShiftPart ? ' следующего дня.' : '. ' + partMessage}`;
        }
        case PERIOD_ID.BEFORE_SHIFT: {
            return `${beginMessageNotWhileShift} ${name} смена начнётся с ${beginShiftTime} до ${endShiftTime} ${isShiftPart ? 'следующего' : 'текущего'} дня.`;
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
    const scheduleDateWithTime = new Date(scheduleDay.currentDate.valueOf());
    scheduleDateWithTime.setHours(hours);
    scheduleDateWithTime.setMinutes(minutes);
    scheduleDateWithTime.setSeconds(seconds);
    return { ...scheduleDay, scheduleDateWithTime };
}
export function getShiftsInfo(shiftList) {
    const days = new Map();
    let index = 0;
    shiftList.forEach(({ name, value: [begin, end], dayOff = false }) => {
        const numberDayOfBeginning = getDayNumberSinceStartYear(begin);
        const numberDayOfEnding = getDayNumberSinceStartYear(end);
        const beginShiftTime = getStringTimeBySeconds(getTimeInSeconds(begin), true);
        const endShiftTime = getStringTimeBySeconds(getTimeInSeconds(end), true);
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
                currentDate: dateOfDay,
                end,
                name,
                isShiftPart: isPart && i !== dayCount - 1,
                isLastShiftPart: isPart && i === dayCount - 1,
                dayOff,
                numberDay: getDayNumberSinceStartYear(dateOfDay),
                beginShiftTime,
                endShiftTime,
            });
        }
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
    const { scheduleDateWithTime, end, begin, dayOff } = scheduleDay;
    const beginShift = +begin / 1000;
    const endShift = +end / 1000;
    const currentTime = scheduleDateWithTime / 1000;

    if (currentDay && !dayOff && currentTime >= endShift) {
        return PERIOD_ID.SHIFT_ENDED;
    }
    if (currentDay && !dayOff && currentTime < beginShift) {
        return PERIOD_ID.BEFORE_SHIFT;
    }
    if (!dayOff) {
        return PERIOD_ID.SHIFT;
    }
    return PERIOD_ID.DAY_OFF;
};

function getTimerValue(id, scheduleDay) {
    const { scheduleDateWithTime, end, begin } = scheduleDay;
    const beginShift = +begin / 1000;
    const endShift = +end / 1000;
    const currentTime = scheduleDateWithTime / 1000;
    switch (id) {
        case PERIOD_ID.SHIFT_ENDED:
        case PERIOD_ID.DAY_OFF: {
            const nextShiftBegin = getNexScheduleDay(scheduleDay, (nextDay) => !nextDay.dayOff && !nextDay.isLastShiftPart).begin / 1000;
            return nextShiftBegin - currentTime; // счётчик до начала смены
        }
        case PERIOD_ID.BEFORE_SHIFT: {
            return beginShift - currentTime; // счётчик до начала смены
        }
        case PERIOD_ID.SHIFT: {
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
function getNexScheduleDay(scheduleDay, conditionCallback) {
    const list = [...schedule.values()];
    let index = scheduleDay.index;
    while (true) {
        if (index === list.length) index = -1;
        const nextScheduleDay = list[++index];
        if (nextScheduleDay && (typeof conditionCallback !== 'function' || conditionCallback(nextScheduleDay))) {
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
