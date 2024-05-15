import { createElement } from './helpers';
export class UserSelector {
    constructor(users) {
        this.users = users;
        this.element = createElement(this.getTemplate());
        this.select = this.element.querySelector('.user-selector__select');
    }

    setValue(value) {
        this.select.value = value;
    }

    setChangeListener(callback) {
        this.element.addEventListener('change', (e) => {
            callback(e.target.value);
        });
    }

    init(container) {
        container.append(this.element);
    }

    getTemplate() {
        return `<div class="user-selector">
          <select class="user-selector__select" name="user">
            <option disabled>Выберите человека</option>
            ${this.users
                .map((item, index) => {
                    return `<option value="${index}">${item.name}</option>`;
                })
                .join()}
          </select>
        </div>`;
    }
}
