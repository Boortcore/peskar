import { createTemplate } from './calendar-template';
import { createElement, formatDate, padTo2Digits } from './helpers';

const MONTH_MAP = {
    0: 'Январь',
    1: 'Февраль',
    2: 'Март',
    3: 'Апрель',
    4: 'Май',
    5: 'Июнь',
    6: 'Июль',
    7: 'Август',
    8: 'Сентябрь',
    9: 'Октябрь',
    10: 'Ноябрь',
    11: 'Декабрь',
};
export class Calendar {
    constructor(year, month, scheduleBuilder, info) {
        this.info = info;
        this.year = year;
        this.month = month;
        this.scheduleBuilder = scheduleBuilder;
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
            const { isShift, isLastShiftPart, color, isShiftPart } = this.scheduleBuilder.getScheduleDayByDate(date);
            const day = date.getDay();
            const itemElement = row.querySelector(`[data-day-index="${day}"]`);
            let itemContent = i;

            if (isShift) {
                itemContent += '*';
            }
            if (isLastShiftPart) {
                itemContent += '**';
            }
            itemElement.textContent = itemContent;
            itemElement.style.backgroundColor = color;
            const isNotWorkingDay = this.info?.[formatDate(date)] || false;
            if (isNotWorkingDay && (isShift || isLastShiftPart || isShiftPart)) {
                itemElement.style.backgroundColor = 'blue';
            }
            if (day === 0) {
                this.contentElement.append(row);
                row = this.createRow();
            }
        }
        if (!row.parentElement) this.contentElement.append(row);
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
