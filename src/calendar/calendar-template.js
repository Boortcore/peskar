export function createTemplate(month, year) {
    return `<div class="calendar">
    <h4 class="calendar__header">${month} ${year}</h4>
    <div class="calendar__content">
      <div class="calendar__row calendar__row--main">
        <span class="calendar__row-item">Пн</span>
        <span class="calendar__row-item">Вт</span>
        <span class="calendar__row-item">Ср</span>
        <span class="calendar__row-item">Чт</span>
        <span class="calendar__row-item">Пт</span>
        <span class="calendar__row-item calendar__row-item--weekend">Сб</span>
        <span class="calendar__row-item calendar__row-item--weekend calendar__row-item--sunday">Вс</span>
      <div>
  <div>`;
}
