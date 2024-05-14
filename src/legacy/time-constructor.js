import { getDayNumberOfYear } from '../helpers';

export class TimeContructor {
    constructor({ dayShift, nightShift, summaryDays, schedule, worker }) {
        this.workingNightNumber = getDayNumberOfYear(dayShift);
        this.workingDayNumber = getDayNumberOfYear(nightShift);
        this.summaryDays = summaryDays;
        this.schedule = schedule;
        this.worker = worker;
    }

    getWorkingInfo(date) {
        const chosenDay = getDayNumberOfYear(date);
        return {
            isDayWorking: isDayWorking(chosenDay),
            isNightWorking: isNightWorking(chosenDay),
            isFirstDayOff: isFirstDayOff(chosenDay),
        };
    }

    isDayWorking(day) {
        return (day - workingDayNumber) % daySummary === 0;
    }

    isNightWorking(day) {
        return (day - workingNightNumber) % daySummary === 0;
    }

    isFirstDayOff(day) {
        return (day - workingDayNumber) % daySummary === 2;
    }

    getContentData2(date, time) {
        const { isDayWorking, isNightWorking, isFirstDayOff } = this.getWorkingInfo(date);
        const text = `${this.worker} сегодня`;

        if (isDayWorking) {
            return text + ' на дневной смене. Завтра в ночь.';
        } else if (isNightWorking) {
            return text + ' на ночной смене.';
        } else if (isFirstDayOff) {
            return text + ' закончил ночную смену. Завтра выходной.';
        } else {
            return text + ' выходной. Завтра в день на работу.';
        }
    }
    // getContentData(date, time) {
    //     const { isDayWorking, isNightWorking, isFirstDayOff } = this.getWorkingInfo(date);
    //     const text = `${this.worker} сегодня`;

    //     if (isDayWorking) {
    //         return text + ' на дневной смене. Завтра в ночь.';
    //     } else if (isNightWorking) {
    //         return text + ' на ночной смене.';
    //     } else if (isFirstDayOff) {
    //         return text + ' закончил ночную смену. Завтра выходной.';
    //     } else {
    //         return text + ' выходной. Завтра в день на работу.';
    //     }
    // }
}
