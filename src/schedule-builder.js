import { getDayNumberSinceStartYear, getStringTimeBySeconds, formatDate, getTimeInSeconds, getDateWithoutTime, getTimeOfDate } from './time-helpers';
import { SUNDAY, SATURDAY } from './constants';

const PERIOD_ID = {
    SHIFT: 0,
    SHIFT_ENDED: 1,
    DAY_OFF: 2,
    BEFORE_SHIFT: 3,
};

function getScheduleDayWithTime(currentDay, scheduleDay) {
    const { hours, minutes, seconds } = getTimeOfDate(currentDay);
    const scheduleDateWithTime = new Date(scheduleDay.currentDate.valueOf());
    scheduleDateWithTime.setHours(hours);
    scheduleDateWithTime.setMinutes(minutes);
    scheduleDateWithTime.setSeconds(seconds);
    return { ...scheduleDay, scheduleDateWithTime, chosenDay: currentDay };
}

const DAY_OF_WEEK_MAP = {
    0: 'воскресенья',
    1: 'понедельника',
    2: 'вторника',
    3: 'среды',
    4: 'четверга',
    5: 'пятницы',
    6: 'субботы',
};

export class ScheduleBuilder {
    constructor(scheduleInfo, productionCalendarInfo) {
        this.productionCalendarInfo = productionCalendarInfo;
        this.schedule = this.createSchedule(scheduleInfo);
    }

    createSchedule(shiftList) {
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
                const dateOfDay = dateOfDays[i] || getDateWithoutTime(begin, i);
                const isShiftPart = isPart && i !== dayCount - 1;
                const isLastShiftPart = isPart && i === dayCount - 1;
                const isShift = !isShiftPart && !isLastShiftPart && !dayOff;
                const scheduleDay = {
                    index: index++,
                    begin,
                    currentDate: dateOfDay,
                    end,
                    name,
                    isShift,
                    isLastShiftPart,
                    isShiftPart,
                    dayOff,
                    numberDay: getDayNumberSinceStartYear(dateOfDay),
                    beginShiftTime,
                    endShiftTime,
                };
                days.set(formatDate(dateOfDay), scheduleDay);
            }
        });
        return [...days.values()];
    }

    getPeriodIdByDate(date, currentDay) {
        const scheduleDay = this.getScheduleDayByDate(date);
        const id = this.getPeriodId(scheduleDay, currentDay);
        return id;
    }

    getPeriodId(scheduleDay, currentDay = false) {
        const { scheduleDateWithTime, end, begin, dayOff } = scheduleDay;
        const beginShift = +begin / 1000;
        const endShift = +end / 1000;
        const currentTime = scheduleDateWithTime / 1000;
        let periodId = null;
        if (currentDay && !dayOff && currentTime >= endShift) {
            periodId = PERIOD_ID.SHIFT_ENDED;
        } else if (currentDay && !dayOff && currentTime < beginShift) {
            periodId = PERIOD_ID.BEFORE_SHIFT;
        } else if (!dayOff) {
            periodId = PERIOD_ID.SHIFT;
        } else {
            periodId = PERIOD_ID.DAY_OFF;
        }
        return periodId;
    }

    getMessageByDate(date, forToday) {
        const scheduleDay = this.getScheduleDayByDate(date);
        const id = this.getPeriodId(scheduleDay, forToday);
        return this.getMessage(id, scheduleDay, forToday);
    }

    getMessage(id, scheduleDay, currentDay) {
        const { beginShiftTime, endShiftTime, name, isShiftPart, isLastShiftPart, chosenDay } = scheduleDay;
        const dayOfWeek = chosenDay.getDay();
        const nextScheduleDay = this.getNexScheduleDay(scheduleDay);
        const beginMessageNotWhileShift = 'В этот день';
        const beginMessage = `${currentDay ? 'Идёт' : beginMessageNotWhileShift}`;
        const partMessage = nextScheduleDay.dayOff ? 'Следующий день - выходной.' : `Следующий день - ${nextScheduleDay.name} смена с ${nextScheduleDay.beginShiftTime}.`;
        switch (id) {
            case PERIOD_ID.SHIFT: {
                const prevDay = dayOfWeek === SUNDAY ? SATURDAY : dayOfWeek - 1;
                const nextDay = dayOfWeek === SATURDAY ? SUNDAY : dayOfWeek + 1;
                const firstShiftDay = isShiftPart ? '' : `прошлого дня (${DAY_OF_WEEK_MAP[prevDay]})`;
                const secondShiftDay = isLastShiftPart ? '' : ` следующего дня (${DAY_OF_WEEK_MAP[nextDay]})`;
                return `${beginMessage} ${name} cмена с ${beginShiftTime} ${isShiftPart || isLastShiftPart ? firstShiftDay : ''} до ${endShiftTime}${isShiftPart || isLastShiftPart ? secondShiftDay + '.' : '' + '. ' + partMessage}`;
            }
            case PERIOD_ID.SHIFT_ENDED: {
                return `${name[0].toUpperCase() + name.slice(1)} смена ${currentDay ? 'завершилась' : 'завершается'} в ${endShiftTime}. ${partMessage}`;
            }
            case PERIOD_ID.BEFORE_SHIFT: {
                return `${beginMessageNotWhileShift} ${name} смена начнётся с ${beginShiftTime} до ${endShiftTime} ${isShiftPart ? 'следующего' : 'текущего'} дня.`;
            }
            case PERIOD_ID.DAY_OFF: {
                return `${beginMessageNotWhileShift} ${name}. ${partMessage}`;
            }
        }
    }

    getShiftDescriptionByDate(date) {
        const id = this.getPeriodIdByDate(date, true);
        const message = `Смена ${id === PERIOD_ID.SHIFT ? 'заканчивается' : 'начинается'} через:`;
        return message;
    }

    getTimerValueByDate(date, currentDay) {
        const scheduleDay = this.getScheduleDayByDate(date);
        const id = this.getPeriodId(scheduleDay, currentDay);
        const timerValue = this.getTimerValue(id, scheduleDay);
        return timerValue;
    }

    getTimerValue(id, scheduleDay) {
        const { scheduleDateWithTime, end, begin } = scheduleDay;
        const beginShift = +begin / 1000;
        const endShift = +end / 1000;
        const currentTime = scheduleDateWithTime / 1000;
        switch (id) {
            case PERIOD_ID.SHIFT_ENDED:
            case PERIOD_ID.DAY_OFF: {
                const nextShiftBegin = this.getNexScheduleDay(scheduleDay, (nextDay) => !nextDay.dayOff && !nextDay.isLastShiftPart).begin / 1000;
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

    getScheduleDayByDate(date) {
        const infoLength = this.schedule.length;
        const dayNumberSinceStartYear = getDayNumberSinceStartYear(date);
        const scheduleDay = this.schedule.find((dayInfo) => (dayNumberSinceStartYear - dayInfo.numberDay) % infoLength === 0);
        const dayOfWeek = date.getDay();
        const isWeekEnd = dayOfWeek === SATURDAY || dayOfWeek === SUNDAY;
        const isWorkingDay = this.productionCalendarInfo?.[formatDate(date)] ?? !isWeekEnd;
        const isHollyDay = !isWorkingDay && !isWeekEnd;
        return getScheduleDayWithTime(date, { ...scheduleDay, isWorkingDay, isHollyDay, isWeekEnd });
    }

    getNexScheduleDay(scheduleDay, conditionCallback) {
        const list = [...this.schedule.values()];
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
}
