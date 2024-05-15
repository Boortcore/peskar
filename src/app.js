import { formatDate, getDateWithoutTime, getDateIteratorByMonthIndex } from './time-helpers';
import { MONTHS_COUNT } from './constants';
import { ScheduleBuilder } from './schedule-builder';
import { View } from './view';
import { Calendar } from './calendar';
import { Legend } from './legend';

export class App {
    constructor(scheduleInfo, legendColors, productionCalendarInfo) {
        this.scheduleBuilder = new ScheduleBuilder(scheduleInfo, productionCalendarInfo);
        this.legend = new Legend(this.scheduleBuilder, legendColors);
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
        this.createCalendars(date);
        container?.append(this.view.element);
    }

    createCalendars(currentDate) {
        const calendarContainer = this.view.element.querySelector('.calendar-container');
        // const legendElement = createElement(createLegendTemplate(this.scheduleBuilder.schedule));

        calendarContainer.append(this.legend.element);
        const getNextMonthDateFromCurrent = getDateIteratorByMonthIndex(currentDate);
        for (let i = 0; i < MONTHS_COUNT; i++) {
            const date = getNextMonthDateFromCurrent(i);
            this.addCalendar(date, calendarContainer);
        }
    }

    addCalendar(date, container) {
        this.calendar = new Calendar(date.getFullYear(), date.getMonth(), this.scheduleBuilder, this.legend);
        container.append(this.calendar.element);
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
