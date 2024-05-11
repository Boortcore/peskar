import { createElement, formatDate } from './helpers';
import { getContentData, getPeriodIdByDate, getTimerValueByDate, isShiftContinue, getStringTimeBySeconds } from './business-logic';
import { appTemplate } from './templates';

export class App {
    constructor() {
        this.view = createElement(appTemplate);
        this.calendarElement = this.view.querySelector('.js-calendar');
        this.chosenInfoContainer = this.view.querySelector('.js-chosen-day-info');
        this.timerContainer = this.view.querySelector('.js-timer-container');
        this.timerFieldset = this.view.querySelector('.js-timer-fieldset');
        this.intervalId = null;
    }

    setListeners() {
        this.calendarElement.addEventListener('change', (e) => {
            const isCurrentDay = formatDate(new Date(e.target.value)) === formatDate(new Date());
            this.setInfo(new Date(e.target.value), isCurrentDay);
        });
    }

    init(container) {
        const date = new Date();
        this.setListeners();
        this.setInfo(date, true);
        container?.append(this.view);
    }

    setTimerValue(seconds) {
        this.timerContainer.textContent = getStringTimeBySeconds(seconds);
    }

    setTimerFieldsetDescription(date) {
        const id = getPeriodIdByDate(date, true);
        const message = `Смена ${isShiftContinue(id) ? 'заканчивается' : 'начинается'} через:`;
        this.timerFieldset.querySelector('legend').textContent = message;
    }

    setTimer(date, isCurrentDay) {
        clearInterval(this.intervalId);
        if (!isCurrentDay) {
            this.timerContainer.textContent = '';
            this.timerFieldset.classList.add('hidden-element');
            return;
        }
        // const date = new Date();
        this.setTimerFieldsetDescription(date);
        this.timerFieldset.classList.remove('hidden-element');
        let secondsNumber = getTimerValueByDate(date, isCurrentDay);
        this.setTimerValue(secondsNumber);
        this.intervalId = setInterval(() => {
            secondsNumber = getTimerValueByDate(new Date(), isCurrentDay);
            this.setTimerValue(secondsNumber);
            if (!secondsNumber) {
                this.setInfo(new Date(), true);
            }
        }, 1000);
    }

    setInfo(date, isCurrentDay) {
        this.calendarElement.value = formatDate(date);
        const data = getContentData(date, isCurrentDay);
        this.chosenInfoContainer.textContent = data;
        this.setTimer(date, isCurrentDay);
    }
}
