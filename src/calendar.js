import { createTemplate } from './calendar-template';
import { createElement } from './helpers';
import { MONTH_MAP, SATURDAY, SUNDAY } from './constants.js';
export class Calendar {
    constructor(year, month, scheduleBuilder, legend) {
        this.year = year;
        this.month = month;
        this.scheduleBuilder = scheduleBuilder;
        this.legend = legend;
        this.element = createElement(createTemplate(MONTH_MAP[month], year));
        this.headerElement = this.element.querySelector('.calendar__header');
        this.contentElement = this.element.querySelector('.calendar__content');
        this.init();
    }

    init() {
        const daysCount = this.getDaysCount();
        let row = this.createRow();
        for (let i = 1; i <= daysCount; i++) {
            const date = this.getDateByDayNumber(i);
            const scheduleDay = this.scheduleBuilder.getScheduleDayByDate(date);
            const { isShift, isLastShiftPart, dayOff } = scheduleDay;
            const color = this.legend.getColor(scheduleDay);
            const day = date.getDay();
            const itemElement = row.querySelector(`[data-day-index="${day}"]`);
            let itemContent = i;

            itemElement.textContent = itemContent;
            itemElement.style.backgroundColor = color;

            if (day === SUNDAY) {
                this.contentElement.append(row);
                row = i < daysCount ? this.createRow() : null;
            }
        }
        if (row) this.contentElement.append(row);
    }

    getDateByDayNumber(number) {
        return new Date(this.year, this.month, number);
    }

    getFirstDate() {
        return getDateByDayNumber(1);
    }

    getFirstDayOfMonthIndex() {
        return this.getFirstDate().getDate();
    }

    getDaysCount() {
        return new Date(this.year, this.month + 1, 0).getDate();
    }

    createRow() {
        const rowElement = createElement(`<div class="calendar__row">
          <span class="calendar__row-item" data-day-index="1"></span>
          <span class="calendar__row-item" data-day-index="2"></span>
          <span class="calendar__row-item" data-day-index="3"></span>
          <span class="calendar__row-item" data-day-index="4"></span>
          <span class="calendar__row-item" data-day-index="5"></span>
          <span class="calendar__row-item" data-day-index="6"></span>
          <span class="calendar__row-item" data-day-index="0"></span>
        <div>`);
        return rowElement;
    }
    createRowItem() {
        const rowElement = createElement(``);
    }
}
