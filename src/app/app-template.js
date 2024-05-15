export const appTemplate = `<form class="content">
  <div class="warning-message hidden-element content__item"></div>
  <fieldset class="fieldset content__item">
    <legend>Выберите дату</legend>
    <input type="date" class="js-datepicker datepicker fieldset__item" /> 
    <span class="js-day-of-week fieldset__item"></span>
    <span class="js-current-time  fieldset__item"></span>
  </fieldset>
  <div class="js-chosen-day-info content__item"></div>
  <fieldset class="fieldset js-timer-fieldset content__item">
    <legend></legend>
    <div class="js-timer-container fieldset__item"></div>
  </fieldset>
  <div class="calendar-container"></div>
</form>`;
