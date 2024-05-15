import { createElement } from './helpers';
const COLOR = {
    SHIFT: 'green',
    SHIFT_PART: 'yellow',
    LAST_SHIFT_PART: 'orange',
    DAYOFF: 'white',
    SHIFT_ON_UNWORKING_DAY: 'blue',
};
export class Legend {
    constructor(sheduleBuilder, colors) {
        this.color = colors;
        this.sheduleBuilder = sheduleBuilder;
        this.element = this.getElement();
    }

    get HOLLYDAY_SHIFT() {
        return this.color.HOLLYDAY_SHIFT || 'pink';
    }
    get WEEKEND_SHIFT() {
        return this.color.WEEKEND_SHIFT || 'blue';
    }
    get SHIFT() {
        return this.color.SHIFT || 'yellow';
    }
    get SHIFT_PART() {
        return this.color.SHIFT_PART || 'pink';
    }
    get LAST_SHIFT_PART() {
        return this.color.LAST_SHIFT_PART || 'orange';
    }
    get DAYOFF() {
        return this.color.DAYOFF || 'white';
    }
    get WEEKEND() {
        return this.color.WEEKEND || 'red';
    }

    getColor({ isShiftPart, isLastShiftPart, isShift, dayOff, isWorkingDay, isHollyDay, isWeekEnd }) {
        if (isWeekEnd && dayOff) {
            return this.WEEKEND;
        }
        if (isHollyDay && (isShiftPart || isLastShiftPart || isShift)) {
            return this.HOLLYDAY_SHIFT;
        }
        if (isWorkingDay === false && (isShiftPart || isLastShiftPart || isShift)) {
            return this.WEEKEND_SHIFT;
        }
        if (isShift) {
            return this.SHIFT;
        }
        if (isShiftPart) {
            return this.color.SHIFT_PART || 'yellow';
        }
        if (isLastShiftPart) {
            return this.color.LAST_SHIFT_PART || 'orange';
        }
        if (dayOff) {
            return this.color.DAYOFF || 'white';
        }
    }

    getElement() {
        return createElement(`<div class="legend">
          <div class="legend__header">Легенда</div>
            ${this.sheduleBuilder.schedule
                .map((schduleDay) => {
                    const { name, dayOff, isShiftPart, isLastShiftPart, beginShiftTime, endShiftTime, isWeekEnd } = schduleDay;
                    let message = `${name[0].toUpperCase() + name.slice(1)} ${!dayOff ? 'смена ' : ''}`;
                    if (isShiftPart) {
                        message += ` c ${beginShiftTime}`;
                    }
                    if (isLastShiftPart) {
                        message += ` до ${endShiftTime}`;
                    }
                    return `<p class="legend__item">
                      <span class="legend__icon" style="background:${this.getColor(schduleDay)}"></span> - ${message} 
                    </p>`;
                })
                .join('')} 
              <p class="legend__item">
                <span class="legend__icon" style="background:${this.HOLLYDAY_SHIFT}"></span> - Смена в праздничный день
              </p>
              <p class="legend__item">
                <span class="legend__icon" style="background:${this.WEEKEND_SHIFT}"></span> - Смена в субботу или воскресенье
              </p>
     
        </div>`);
        // <p class="legend__item"><b class="legend__asterisk">*</b> - Вечером будет пить</p>
        // <p class="legend__item"><b class="legend__asterisk">**</b> - Возможно будет пить с обеда</p>
    }
}
