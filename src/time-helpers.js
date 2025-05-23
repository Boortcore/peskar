import { declOfNum } from './helpers';
const HOURS_IN_DAY = 24;
const daysNumberDescription = ['день', 'дня', 'дней'];

export const padTo2Digits = (num) => num.toString().padStart(2, '0');

export const formatDate = (date) => [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join('-');

const padNumbersTo2Digits = (list) => list.map((item) => padTo2Digits(item)).join(':');

export function getStringTimeBySeconds(secondsNumber, withoutSeconds = false) {
    const value = parseSecondForTimer(secondsNumber, withoutSeconds);
    const [hours, minutes, seconds] = value;
    if (hours < HOURS_IN_DAY) {
        return padNumbersTo2Digits(value);
    }
    const daysNumber = Math.floor(hours / HOURS_IN_DAY);
    const lastHours = hours - daysNumber * 24;
    return `${daysNumber} ${declOfNum(daysNumber, daysNumberDescription)} ${padNumbersTo2Digits([lastHours, minutes, seconds])}`;
}

export const getDayNumberSinceStartYear = (date) => {
    const startedTime = +new Date(2022, 0, 1);
    const diff = +date - startedTime;
    return Math.floor(diff / 1000 / 60 / 60 / 24);
};

export function getTimeInSeconds(date) {
    const { hours, minutes, seconds } = getTimeOfDate(date);
    const timeInSeconds = hours * 60 * 60 + minutes * 60 + seconds;
    return timeInSeconds;
}

export function getStringTimeByDate(date) {
    const { hours, minutes, seconds } = getTimeOfDate(date);
    return [hours, minutes, seconds].map((item) => padTo2Digits(item)).join(':');
}

export function parseSecondForTimer(secondsNumber, withoutSeconds) {
    const hours = Math.floor(secondsNumber / (60 * 60));
    const minutes = Math.floor((secondsNumber - hours * 60 * 60) / 60);
    const seconds = !withoutSeconds ? secondsNumber - (hours * 60 * 60 + minutes * 60) : 0;
    return [hours, minutes].concat(!withoutSeconds ? seconds : []);
}

export function getTimeOfDate(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return { hours, minutes, seconds };
}

export function getDateWithoutTime(date, offset = 1) {
    const day = new Date(date.valueOf());
    day.setDate(day.getDate() + offset);
    day.setHours(0);
    day.setMinutes(0);
    day.setSeconds(0);
    return day;
}

export function getDateIteratorByMonthIndex(currentDate) {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return function (i) {
        let date = new Date(+currentDate);
        date.setYear(currentYear);
        date.setMonth(currentMonth + i);
        return date;
    };
}
