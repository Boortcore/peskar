import { formatDate, getDateWithoutTime } from './time-helpers';

import { ScheduleBuilder } from './schedule-builder';
import { View } from './view';

export class App {
    constructor(scheduleInfo) {
        this.scheduleBuilder = new ScheduleBuilder(scheduleInfo);
        this.view = new View();
        this.intervalId = null;
    }

    setListeners() {
        this.view.setChangeDateHandler((e) => {
            const newDate = new Date(e.target.value);
            const isCurrentDay = formatDate(newDate) === formatDate(new Date());
            this.setInfo(isCurrentDay ? new Date() : getDateWithoutTime(newDate), isCurrentDay);
        });
    }

    init(container) {
        const date = new Date(2024, 4, 16, 8, 1, 0);
        this.setListeners();
        this.setInfo(date, true);
        container?.append(this.view.element);
    }

    setTimer(date, isCurrentDay) {
        clearInterval(this.intervalId);
        if (!isCurrentDay) {
            this.view.toggleTimerFieldsetVisibility(false);
            return;
        }
        // const date = new Date();
        const timerDescription = this.scheduleBuilder.getShiftDescriptionByDate(date);
        this.view.setTimerFieldsetDescription(timerDescription);
        this.view.toggleTimerFieldsetVisibility(true);
        let secondsNumber = this.scheduleBuilder.getTimerValueByDate(date, isCurrentDay);
        this.view.setTimerValue(secondsNumber);
        let day = null;
        this.intervalId = setInterval(() => {
            const newDate = date;
            date.setSeconds(date.getSeconds() + 1);
            secondsNumber = this.scheduleBuilder.getTimerValueByDate(newDate, isCurrentDay);
            this.view.setTimerValue(secondsNumber);
            this.view.setCurrentTime(date, isCurrentDay);
            if (!secondsNumber || (day && newDate.getDate() !== day)) {
                this.setInfo(date, true);
            }
            day = newDate.getDate();
        }, 1000);
    }

    getContentData(date, forToday = false) {
        return this.scheduleBuilder.getMessageByDate(date, forToday);
    }

    setInfo(date, forToday) {
        const data = this.getContentData(date, forToday);
        this.view.setDateValue(date);
        this.view.setCurrentTime(date, forToday);
        this.view.setContentData(data);
        this.setTimer(date, forToday);
    }
}
