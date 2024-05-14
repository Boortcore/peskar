import { formatDate, getDateWithoutTime } from './time-helpers';

import { ScheduleBuilder } from './schedule-builder';
import { View } from './view';
import { Calendar } from './calendar';
import { createLegendTemplate } from './legend-template';
import { createElement, padTo2Digits } from './helpers';
const MONTHS_COUNT = 12;
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
            this.setInfo(isCurrentDay ? new Date() : getDateWithoutTime(newDate, 0), isCurrentDay);
        });
    }

    init(container) {
        const date = new Date();
        this.setListeners();
        this.setInfo(date, true);
        container?.append(this.view.element);
        this.createCalendars(date);
    }

    createCalendars(currentDate) {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const calendarContainer = this.view.element.querySelector('.calendar-container');
        const legendElement = createElement(createLegendTemplate([...this.scheduleBuilder.schedule.values()]));
        calendarContainer.append(legendElement);

        const promiseCollection = [];
        for (let i = 0; i < MONTHS_COUNT; i++) {
            let date = new Date(+currentDate);
            date.setYear(currentYear);
            date.setMonth(currentMonth + i);
            const url = `https://isdayoff.ru/api/getdata?year=${date.getFullYear()}&month=${date.getMonth() + 1}`;
            promiseCollection.push(fetch(url).then((res) => res.text()));
        }
        Promise.all(promiseCollection)
            .then((results) => {
                results.forEach((res, index) => {
                    let date = new Date(+currentDate);
                    date.setYear(currentYear);
                    date.setMonth(currentMonth + index);
                    const info = res.split('');
                    const result = info.reduce((acc, item, index) => {
                        date.setDate(index + 1);
                        acc[formatDate(date)] = +item;
                        return acc;
                    }, {});
                    this.generateCalendar(date, result);
                });
            })
            .catch(() => {
                let date = new Date(+currentDate);
                for (let i = 0; i < MONTHS_COUNT; i++) {
                    date.setYear(currentYear);
                    date.setMonth(currentMonth + i);
                    this.generateCalendar(date);
                }
            });
    }

    generateCalendar(date, info) {
        const calendarContainer = this.view.element.querySelector('.calendar-container');
        this.calendar = new Calendar(date.getFullYear(), date.getMonth(), this.scheduleBuilder, info);
        calendarContainer.append(this.calendar.element);
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
            const newDate = new Date();
            secondsNumber = this.scheduleBuilder.getTimerValueByDate(newDate, isCurrentDay);
            this.view.setTimerValue(secondsNumber);
            this.view.setCurrentTime(newDate, isCurrentDay);
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
