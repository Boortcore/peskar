export const appTemplate = `<form class="content">
  <div class="warning-message hidden-element"></div>
  <fieldset class="fieldset">

    <legend>Выберите дату</legend>
    <input type="date" class="js-calendar daypicker" /> 
    <span class="js-day-of-week day-of-week"></span>
    <span class="js-current-time current-time"></span>
  </fieldset>
  <div class="js-chosen-day-info chosen-day-info"></div>
  <fieldset class="fieldset js-timer-fieldset">
  <legend></legend>
    <div class="js-timer-container timer-container"></div>
  </fieldset>
  <div class="calendar-container"></div>
</form>`;
