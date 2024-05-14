import { getStringTimeBySeconds, formatDate, getStringTimeByDate } from './time-helpers';
import { createElement } from './helpers';
import { appTemplate } from './app-template';
const DAY_WEEK = {
    0: 'Воскресенье',
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
};

export class View {
    constructor() {
        this.element = createElement(appTemplate);
        this.calendarElement = this.element.querySelector('.js-calendar');
        this.chosenInfoContainer = this.element.querySelector('.js-chosen-day-info');
        this.timerContainer = this.element.querySelector('.js-timer-container');
        this.timerFieldset = this.element.querySelector('.js-timer-fieldset');
        this.dayOfWeekElement = this.element.querySelector('.js-day-of-week');
        this.currentTimeElement = this.element.querySelector('.js-current-time');
    }

    setTimerValue(seconds) {
        this.timerContainer.textContent = getStringTimeBySeconds(seconds);
    }

    setTimerFieldsetDescription(value) {
        this.timerFieldset.querySelector('legend').textContent = value;
    }

    setDayOfWeek(date) {
        this.dayOfWeekElement.textContent = DAY_WEEK[date.getDay()];
    }

    setDateValue(date) {
        this.calendarElement.value = formatDate(date);
        this.dayOfWeekElement.textContent = DAY_WEEK[date.getDay()];
    }

    setCurrentTime(date, isCurrentDay) {
        if (!isCurrentDay) this.currentTimeElement.classList.add('hidden-element');
        else {
            this.currentTimeElement.classList.remove('hidden-element');
            this.currentTimeElement.textContent = getStringTimeByDate(date);
        }
    }

    setContentData(data) {
        this.chosenInfoContainer.textContent = data;
    }

    setChangeDateHandler(handler) {
        this.calendarElement.addEventListener('change', handler);
    }

    toggleTimerFieldsetVisibility(flag) {
        this.timerFieldset.classList.toggle('hidden-element', !flag);
        if (!flag) this.timerContainer.textContent = '';
    }
}
