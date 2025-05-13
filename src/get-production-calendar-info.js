import { MONTHS_COUNT } from './constants.js';
import { formatDate, getDateIteratorByMonthIndex } from './time-helpers';

export function getProductionCalendarInfo(currentDate) {
    const promiseCollection = [];
    const getNextMonthDateFromCurrent = getDateIteratorByMonthIndex(currentDate);
    for (let i = 0; i < MONTHS_COUNT; i++) {
        const date = getNextMonthDateFromCurrent(i);
        const url = `https://isdayoff.ru/api/getdata?year=${date.getFullYear()}&month=${date.getMonth() + 1}`;
        promiseCollection.push(fetch(url).then((res) => res.text()));
    }
    return Promise.all(promiseCollection).then((results) => {
        const getNextMonthDateFromCurrent = getDateIteratorByMonthIndex(currentDate);
        return results.reduce((acc, res, index) => {
            const date = getNextMonthDateFromCurrent(index);
            const info = res.split('');
            const result = info.reduce((acc, item, index) => {
                date.setDate(index + 1);
                acc[formatDate(date)] = !+item;
                return acc;
            }, {});
            return { ...acc, ...result };
        }, {});
    });
}
