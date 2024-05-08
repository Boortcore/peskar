import { createElement, formatDate } from './helpers';
import { getContentData } from './business-logic';
import { appTemplate } from './templates';

export class App {
    constructor() {
        this.view = createElement(appTemplate);
        this.calendarElement = this.view.querySelector('.js-calendar');
        this.currentDayInfoContainer = this.view.querySelector('.js-current-day-info');
    }

    setListeners() {
        this.calendarElement.addEventListener('change', (e) => this.setInfo(new Date(e.target.value), true));
    }

    init(container) {
        const date = new Date(2024, 4, 12, 15, 0, 0);
        this.calendarElement.value = formatDate(date);
        this.setListeners();
        this.setInfo(date, true);
        container?.append(this.view);
    }

    setInfo(date, considerTime) {
        const data = getContentData(date, considerTime);
        this.currentDayInfoContainer.innerHTML = data;
    }
}
