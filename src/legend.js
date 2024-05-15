import { createElement } from './helpers';
const GRADIENT_PERCENT = '70%';

export class Legend {
    constructor(sheduleBuilder, colors) {
        this.color = colors;
        this.sheduleBuilder = sheduleBuilder;
        this.template = this.getTemplate();
        this.element = this.getElement(this.template);
    }

    getTemplate() {
        return `<div class="legend">
            <div class="legend__header">Легенда</div>
            ${this.sheduleBuilder.schedule
                .map((schduleDay) => {
                    const { name, dayOff, isShiftPart, isShift, isLastShiftPart, beginShiftTime, endShiftTime } = schduleDay;
                    let message = `${name[0].toUpperCase() + name.slice(1)} ${!dayOff ? 'смена ' : ''}`;
                    if (isShiftPart || isShift) {
                        message += ` c ${beginShiftTime}`;
                    }
                    if (isLastShiftPart || isShift) {
                        message += ` до ${endShiftTime}`;
                    }

                    return `<p class="legend__item">
                        <span class="legend__icon" style="background:${this.getColor(schduleDay)}"></span> - ${message} 
                    </p>`;
                })
                .join('')} 
                <p class="legend__item">
                    <span class="legend__icon" style="background:${this.getIconGradiend(this.HOLLYDAY_SHIFT)}"></span> - Смена в праздничный день
                </p>
                <p class="legend__item">
                    <span class="legend__icon" style="background:${this.getIconGradiend(this.WEEKEND_SHIFT)}"></span> - Смена в субботу или воскресенье
                </p>
                <p class="legend__item">
                    <span class="legend__icon" style="background:${this.WEEKEND}"></span> - Нерабочие суббота и воскресенье
                </p>
        </div>`;
    }
    get HOLLYDAY_SHIFT() {
        return this.color.HOLLYDAY_SHIFT || 'pink';
    }
    get WEEKEND_SHIFT() {
        return this.color.WEEKEND_SHIFT || 'blue';
    }
    get SHIFT() {
        return this.color.SHIFT || 'green';
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
        // При отсутствии данных API isHollyDay будет всегда иметь значение false
        if (isHollyDay && isShift) {
            return this.getGradient(this.SHIFT, this.HOLLYDAY_SHIFT);
        }
        if (isHollyDay && isShiftPart) {
            return this.getGradient(this.SHIFT_PART, this.HOLLYDAY_SHIFT);
        }
        if (isHollyDay && isLastShiftPart) {
            return this.getGradient(this.LAST_SHIFT_PART, this.HOLLYDAY_SHIFT);
        }
        // isWorkingDay имеет значение undefined при формировании цвета иконок легенды, поэтому требуется cтрогая проверка на булево значение false
        // Почему не используем !isWeekEnd: в производственном календаре суббота или воскресенье могут быть рабочим днём. isWokingDay формируется на основе данных API.
        // Без загруженных данных isWorkingDay === !isWeekEnd всегда. С данными от сервера рабочий день может быть субботой или воскресеньем.
        if (isWorkingDay === false && isShiftPart) {
            return this.getGradient(this.SHIFT_PART, this.WEEKEND_SHIFT);
        }
        if (isWorkingDay === false && isLastShiftPart) {
            return this.getGradient(this.LAST_SHIFT_PART, this.WEEKEND_SHIFT);
        }
        if (isWorkingDay === false && isShift) {
            return this.getGradient(this.SHIFT, this.WEEKEND_SHIFT);
        }
        if (isShift) {
            return this.SHIFT;
        }
        if (isShiftPart) {
            return this.SHIFT_PART;
        }
        if (isLastShiftPart) {
            return this.LAST_SHIFT_PART;
        }
        if (dayOff) {
            return this.DAYOFF;
        }
    }

    getGradient(startColor, endColor, percent = GRADIENT_PERCENT) {
        return `linear-gradient(to bottom right, ${startColor} ${percent}, ${endColor} ${GRADIENT_PERCENT} 100%)`;
    }

    getIconGradiend(endColor) {
        return this.getGradient('white', endColor, '40%');
    }

    getElement(template) {
        return createElement(template);
        // <p class="legend__item"><b class="legend__asterisk">*</b> - Вечером будет пить</p>
        // <p class="legend__item"><b class="legend__asterisk">**</b> - Возможно будет пить с обеда</p>
    }
}
