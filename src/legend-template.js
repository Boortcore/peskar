export function createLegendTemplate(schedule) {
    const legendTemplate = `
    <div class="legend">
      <div class="legend__header">Легенда</div>
      ${schedule
          .map((schduleDay) => {
              const { name, color, dayOff, isShiftPart, isLastShiftPart, beginShiftTime, endShiftTime } = schduleDay;
              let message = `${name[0].toUpperCase() + name.slice(1)} ${!dayOff ? 'смена ' : ''}`;
              if (isShiftPart) {
                  message += ` c ${beginShiftTime}`;
              }
              if (isLastShiftPart) {
                  message += ` до ${endShiftTime}`;
              }
              return `<p class="legend__item">
                <span class="legend__icon" style="background:${color}"></span> - ${message} 
              </p>`;
          })
          .join('')} 
          <p class="legend__item">
                <span class="legend__icon" style="background:blue"></span> - Смена в нерабочий день
              </p>
          <p class="legend__item"><b class="legend__asterisk">*</b> - Вечером будет пить</p>
          <p class="legend__item"><b class="legend__asterisk">**</b> - Возможно будет пить с обеда</p>
    </div>
  `;
    return legendTemplate;
}
