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
        this.calendarElement.addEventListener('change', (e) => this.setInfo(new Date(e.target.value)));
    }

    init(container) {
        this.calendarElement.value = formatDate(new Date());
        this.setListeners();
        this.setInfo(new Date(), true);
        container?.append(this.view);
    }

    setInfo(date, considerTime) {
        const data = getContentData(date, considerTime);
        this.currentDayInfoContainer.innerHTML = data;
    }
}
