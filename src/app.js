import { createElement, formatDate } from './helpers';
import { getContentData, getStringTimerValue, getPeriodId, getSecondsToNextPeriod, isShiftContinue } from './business-logic';
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
        this.calendarElement.value = formatDate(date);
        this.setListeners();
        this.setInfo(date, true);
        container?.append(this.view);
    }

    setTimerValue(value) {
        this.timerContainer.textContent = getStringTimerValue(value);
    }

    setTimerFieldsetDescription(date) {
        const id = getPeriodId(date, true);
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
        this.setTimerFieldsetDescription(date);
        this.timerFieldset.classList.remove('hidden-element');
        let secondsNumber = getSecondsToNextPeriod(date);
        this.setTimerValue(secondsNumber);
        this.intervalId = setInterval(() => {
            this.setTimerValue(--secondsNumber);
            if (!secondsNumber) {
                this.setInfo(new Date(), true);
            }
        }, 1000);
    }

    setInfo(date, isCurrentDay) {
        const data = getContentData(date, isCurrentDay);
        this.chosenInfoContainer.textContent = data;
        this.setTimer(date, isCurrentDay);
    }
}
