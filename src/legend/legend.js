import { HOLLYDAY_SHIFT, NON_WORKING_DAY, WEEKEND_SHIFT } from '../constants';
import { createElement } from '../helpers';
const GRADIENT_PERCENT = '70%';
const ADDITIONAL_ITEMS = [
    { description: 'Смена в праздничный день', id: HOLLYDAY_SHIFT },
    { description: 'Смена в субботу или воскресенье', id: WEEKEND_SHIFT },
    { description: 'Нерабочие дни', id: NON_WORKING_DAY },
];

export class Legend {
    constructor(schedule, colors) {
        this.colors = colors;
        this.schedule = schedule;
        this.template = this.getTemplate();
        this.element = this.getElement(this.template);
        this.pickers = [];
        this.init();
    }

    init() {
        this.pickers = this.getItems();
        this.element.append(...this.pickers);
        // container.append(this.element);
    }

    setChangeCallback(callback = () => {}) {
        this.element.addEventListener('change', (e) => {
            const picker = e.target;
            callback({ id: picker.dataset.scheduleDayIndex, value: picker.value });
        });
    }
    getItems() {
        const map = this.schedule.reduce((acc, scheduleDay) => {
            const { dayId } = scheduleDay;
            acc.set(dayId, this.getItem(scheduleDay));
            return acc;
        }, new Map());
        const additionalItems = ADDITIONAL_ITEMS.map(({ description, id }) => {
            return createElement(this.getItemTemplate({ id, description }));
        });
        const result = [...map.values(), ...additionalItems];
        return result;
    }

    getItem(scheduleDay) {
        const { name, isShiftPart, isShift, isLastShiftPart, beginShiftTime, endShiftTime, dayId } = scheduleDay;
        let message = `${name[0].toUpperCase() + name.slice(1)}`;
        if (isShiftPart || isShift) {
            message += ` c ${beginShiftTime}`;
        }
        if (isLastShiftPart || isShift) {
            message += ` до ${endShiftTime}`;
        }
        return createElement(this.getItemTemplate({ id: dayId, description: message }));
    }

    getItemTemplate({ id, description }) {
        return `<div class="legend__item">
          <input type="color" class="legend__icon" value="${this.colors[id]}" data-schedule-day-index=${id}> - ${description} 
        </div>`;
    }

    getTemplate() {
        return `<div class="legend content__item">
            <div class="legend__header">Легенда</div>
        </div>`;
    }
    get [HOLLYDAY_SHIFT]() {
        return this.colors[HOLLYDAY_SHIFT] || 'pink';
    }
    get [WEEKEND_SHIFT]() {
        return this.colors[WEEKEND_SHIFT] || 'blue';
    }
    get [NON_WORKING_DAY]() {
        return this.colors[NON_WORKING_DAY] || 'red';
    }

    getColor({ isShiftPart, isLastShiftPart, isShift, dayOff, isWorkingDay, isHollyDay, isWeekEnd, dayId }) {
        const mainColor = this.colors[dayId];

        // При отсутствии данных API isHollyDay будет всегда иметь значение false
        if (isHollyDay && isShift) {
            return this.getGradient(mainColor, this.HOLLYDAY_SHIFT);
        }
        if (isHollyDay && isShiftPart) {
            return this.getGradient(mainColor, this.HOLLYDAY_SHIFT);
        }
        if (isHollyDay && isLastShiftPart) {
            return this.getGradient(mainColor, this.HOLLYDAY_SHIFT);
        }
        if (((isWeekEnd && dayOff) || isHollyDay) && isWorkingDay === false) {
            return this.NON_WORKING_DAY;
        }
        // isWorkingDay имеет значение undefined при формировании цвета иконок легенды, поэтому требуется cтрогая проверка на булево значение false
        // Почему не используем !isWeekEnd: в производственном календаре суббота или воскресенье могут быть рабочим днём. isWokingDay формируется на основе данных API.
        // Без загруженных данных isWorkingDay === !isWeekEnd всегда. С данными от сервера рабочий день может быть субботой или воскресеньем.
        if (isWorkingDay === false && isShiftPart) {
            return this.getGradient(mainColor, this.WEEKEND_SHIFT);
        }
        if (isWorkingDay === false && isLastShiftPart) {
            return this.getGradient(mainColor, this.WEEKEND_SHIFT);
        }
        if (isWorkingDay === false && isShift) {
            return this.getGradient(mainColor, this.WEEKEND_SHIFT);
        }
        if (isShift || isShiftPart || isLastShiftPart) {
            return mainColor;
        }

        if (dayOff) {
            return mainColor;
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
