/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app/app-template.js":
/*!*********************************!*\
  !*** ./src/app/app-template.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   appTemplate: () => (/* binding */ appTemplate)
/* harmony export */ });
var appTemplate = "<form class=\"content\">\n  <div class=\"warning-message hidden-element content__item\"></div>\n  <fieldset class=\"fieldset content__item\">\n    <legend>\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0430\u0442\u0443</legend>\n    <input type=\"date\" class=\"js-datepicker datepicker fieldset__item\" /> \n    <span class=\"js-day-of-week fieldset__item\"></span>\n    <span class=\"js-current-time  fieldset__item\"></span>\n  </fieldset>\n  <div class=\"js-chosen-day-info content__item\"></div>\n  <fieldset class=\"fieldset js-timer-fieldset content__item\">\n    <legend></legend>\n    <div class=\"js-timer-container fieldset__item\"></div>\n  </fieldset>\n  <div class=\"calendar-container\"></div>\n</form>";

/***/ }),

/***/ "./src/app/app.js":
/*!************************!*\
  !*** ./src/app/app.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   App: () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var _time_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../time-helpers */ "./src/time-helpers.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
/* harmony import */ var _schedule_bulder_schedule_builder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../schedule-bulder/schedule-builder */ "./src/schedule-bulder/schedule-builder.js");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view */ "./src/app/view.js");
/* harmony import */ var _calendar_calendar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../calendar/calendar */ "./src/calendar/calendar.js");
/* harmony import */ var _legend_legend__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../legend/legend */ "./src/legend/legend.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }






var App = /*#__PURE__*/function () {
  function App(scheduleInfo, legendColors, _ref, productionCalendarInfo, warningMessage) {
    var saveColors = _ref.saveColors;
    _classCallCheck(this, App);
    this.scheduleBuilder = new _schedule_bulder_schedule_builder__WEBPACK_IMPORTED_MODULE_2__.ScheduleBuilder(scheduleInfo, productionCalendarInfo);
    this.legend = new _legend_legend__WEBPACK_IMPORTED_MODULE_5__.Legend(this.scheduleBuilder.schedule, legendColors);
    this.view = new _view__WEBPACK_IMPORTED_MODULE_3__.View();
    this.intervalId = null;
    this.legendColors = legendColors;
    if (warningMessage) {
      this.view.showWarningMessage(warningMessage);
    }
    this.saveColors = saveColors;
  }
  return _createClass(App, [{
    key: "setListeners",
    value: function setListeners() {
      var _this = this;
      this.view.setChangeDateHandler(function (e) {
        var newDate = new Date(e.target.value);
        var isCurrentDay = (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.formatDate)(newDate) === (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.formatDate)(new Date());
        _this.setInfo(isCurrentDay ? new Date() : (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getDateWithoutTime)(newDate, 0), isCurrentDay);
      });
    }
  }, {
    key: "init",
    value: function init(container) {
      var date = new Date();
      this.setListeners();
      this.setInfo(date, true);
      this.createCalendars(date);
      container === null || container === void 0 || container.append(this.view.element);
    }
  }, {
    key: "createCalendars",
    value: function createCalendars(currentDate) {
      var _this2 = this;
      var calendarContainer = this.view.element.querySelector('.calendar-container');
      this.view.element.insertBefore(this.legend.element, calendarContainer);
      this.legend.setChangeCallback(function (_ref2) {
        var id = _ref2.id,
          value = _ref2.value;
        calendarContainer.innerHTML = '';
        _this2.legendColors[id] = value;
        _this2.generateCalendars(new Date(), calendarContainer);
        _this2.saveColors(_this2.legendColors);
      });
      this.generateCalendars(currentDate, calendarContainer);
    }
  }, {
    key: "generateCalendars",
    value: function generateCalendars(currentDate, container) {
      var getNextMonthDateFromCurrent = (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getDateIteratorByMonthIndex)(currentDate);
      for (var i = 0; i < _constants__WEBPACK_IMPORTED_MODULE_1__.MONTHS_COUNT; i++) {
        var date = getNextMonthDateFromCurrent(i);
        this.addCalendar(date, container);
      }
    }
  }, {
    key: "addCalendar",
    value: function addCalendar(date, container) {
      this.calendar = new _calendar_calendar__WEBPACK_IMPORTED_MODULE_4__.Calendar(date.getFullYear(), date.getMonth(), this.scheduleBuilder, this.legend);
      container.append(this.calendar.element);
    }
  }, {
    key: "setTimer",
    value: function setTimer(date, isCurrentDay) {
      var _this3 = this;
      clearInterval(this.intervalId);
      if (!isCurrentDay) {
        this.view.toggleTimerFieldsetVisibility(false);
        return;
      }
      // const date = new Date();
      var timerDescription = this.scheduleBuilder.getShiftDescriptionByDate(date);
      this.view.setTimerFieldsetDescription(timerDescription);
      this.view.toggleTimerFieldsetVisibility(true);
      var secondsNumber = this.scheduleBuilder.getTimerValueByDate(date, isCurrentDay);
      this.view.setTimerValue(secondsNumber);
      var day = null;
      this.intervalId = setInterval(function () {
        var newDate = new Date();
        secondsNumber = _this3.scheduleBuilder.getTimerValueByDate(newDate, isCurrentDay);
        _this3.view.setTimerValue(secondsNumber);
        _this3.view.setCurrentTime(newDate, isCurrentDay);
        if (!secondsNumber || day && newDate.getDate() !== day) {
          _this3.setInfo(date, true);
        }
        day = newDate.getDate();
      }, 1000);
    }
  }, {
    key: "getContentData",
    value: function getContentData(date) {
      var forToday = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return this.scheduleBuilder.getMessageByDate(date, forToday);
    }
  }, {
    key: "setInfo",
    value: function setInfo(date, forToday) {
      var data = this.getContentData(date, forToday);
      this.view.setDateValue(date);
      this.view.setCurrentTime(date, forToday);
      this.view.setContentData(data);
      this.setTimer(date, forToday);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      clearInterval(this.intervalId);
      this.view.destroy();
    }
  }]);
}();

/***/ }),

/***/ "./src/app/view.js":
/*!*************************!*\
  !*** ./src/app/view.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   View: () => (/* binding */ View)
/* harmony export */ });
/* harmony import */ var _time_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../time-helpers */ "./src/time-helpers.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ "./src/helpers.js");
/* harmony import */ var _app_template__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app-template */ "./src/app/app-template.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var DAY_WEEK = {
  0: 'Воскресенье',
  1: 'Понедельник',
  2: 'Вторник',
  3: 'Среда',
  4: 'Четверг',
  5: 'Пятница',
  6: 'Суббота'
};
var View = /*#__PURE__*/function () {
  function View() {
    _classCallCheck(this, View);
    this.element = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.createElement)(_app_template__WEBPACK_IMPORTED_MODULE_2__.appTemplate);
    this.calendarElement = this.element.querySelector('.js-datepicker');
    this.chosenInfoContainer = this.element.querySelector('.js-chosen-day-info');
    this.timerContainer = this.element.querySelector('.js-timer-container');
    this.timerFieldset = this.element.querySelector('.js-timer-fieldset');
    this.dayOfWeekElement = this.element.querySelector('.js-day-of-week');
    this.currentTimeElement = this.element.querySelector('.js-current-time');
  }
  return _createClass(View, [{
    key: "showWarningMessage",
    value: function showWarningMessage(message) {
      var warningMessageElement = this.element.querySelector('.warning-message');
      warningMessageElement.textContent = message;
      warningMessageElement.classList.remove('hidden-element');
    }
  }, {
    key: "setTimerValue",
    value: function setTimerValue(seconds) {
      this.timerContainer.textContent = (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getStringTimeBySeconds)(seconds);
    }
  }, {
    key: "setTimerFieldsetDescription",
    value: function setTimerFieldsetDescription(value) {
      this.timerFieldset.querySelector('legend').textContent = value;
    }
  }, {
    key: "setDayOfWeek",
    value: function setDayOfWeek(date) {
      this.dayOfWeekElement.textContent = DAY_WEEK[date.getDay()];
    }
  }, {
    key: "setDateValue",
    value: function setDateValue(date) {
      this.calendarElement.value = (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.formatDate)(date);
      this.dayOfWeekElement.textContent = DAY_WEEK[date.getDay()];
    }
  }, {
    key: "setCurrentTime",
    value: function setCurrentTime(date, isCurrentDay) {
      if (!isCurrentDay) this.currentTimeElement.classList.add('hidden-element');else {
        this.currentTimeElement.classList.remove('hidden-element');
        this.currentTimeElement.textContent = (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getStringTimeByDate)(date);
      }
    }
  }, {
    key: "setContentData",
    value: function setContentData(data) {
      this.chosenInfoContainer.textContent = data;
    }
  }, {
    key: "setChangeDateHandler",
    value: function setChangeDateHandler(handler) {
      this.calendarElement.addEventListener('change', handler);
    }
  }, {
    key: "toggleTimerFieldsetVisibility",
    value: function toggleTimerFieldsetVisibility(flag) {
      this.timerFieldset.classList.toggle('hidden-element', !flag);
      if (!flag) this.timerContainer.textContent = '';
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.element.remove();
    }
  }]);
}();

/***/ }),

/***/ "./src/calendar/calendar-template.js":
/*!*******************************************!*\
  !*** ./src/calendar/calendar-template.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTemplate: () => (/* binding */ createTemplate)
/* harmony export */ });
function createTemplate(month, year) {
  return "<div class=\"calendar\">\n    <h4 class=\"calendar__header\">".concat(month, " ").concat(year, "</h4>\n    <div class=\"calendar__content\">\n      <div class=\"calendar__row calendar__row--main\">\n        <span class=\"calendar__row-item\">\u041F\u043D</span>\n        <span class=\"calendar__row-item\">\u0412\u0442</span>\n        <span class=\"calendar__row-item\">\u0421\u0440</span>\n        <span class=\"calendar__row-item\">\u0427\u0442</span>\n        <span class=\"calendar__row-item\">\u041F\u0442</span>\n        <span class=\"calendar__row-item calendar__row-item--weekend\">\u0421\u0431</span>\n        <span class=\"calendar__row-item calendar__row-item--weekend calendar__row-item--sunday\">\u0412\u0441</span>\n      <div>\n  <div>");
}

/***/ }),

/***/ "./src/calendar/calendar.js":
/*!**********************************!*\
  !*** ./src/calendar/calendar.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Calendar: () => (/* binding */ Calendar)
/* harmony export */ });
/* harmony import */ var _calendar_template__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./calendar-template */ "./src/calendar/calendar-template.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ "./src/helpers.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var Calendar = /*#__PURE__*/function () {
  function Calendar(year, month, scheduleBuilder, legend) {
    _classCallCheck(this, Calendar);
    this.year = year;
    this.month = month;
    this.scheduleBuilder = scheduleBuilder;
    this.legend = legend;
    this.element = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.createElement)((0,_calendar_template__WEBPACK_IMPORTED_MODULE_0__.createTemplate)(_constants_js__WEBPACK_IMPORTED_MODULE_2__.MONTH_MAP[month], year));
    this.headerElement = this.element.querySelector('.calendar__header');
    this.contentElement = this.element.querySelector('.calendar__content');
    this.init();
  }
  return _createClass(Calendar, [{
    key: "init",
    value: function init() {
      var daysCount = this.getDaysCount();
      var row = this.createRow();
      for (var i = 1; i <= daysCount; i++) {
        var date = this.getDateByDayNumber(i);
        var scheduleDay = this.scheduleBuilder.getScheduleDayByDate(date);
        var color = this.legend.getColor(scheduleDay);
        var day = date.getDay();
        var itemElement = row.querySelector("[data-day-index=\"".concat(day, "\"]"));
        var itemContent = i;
        itemElement.textContent = itemContent;
        itemElement.style.background = color;
        if (day === _constants_js__WEBPACK_IMPORTED_MODULE_2__.SUNDAY) {
          this.contentElement.append(row);
          row = i < daysCount ? this.createRow() : null;
        }
      }
      if (row) this.contentElement.append(row);
    }
  }, {
    key: "getDateByDayNumber",
    value: function getDateByDayNumber(number) {
      return new Date(this.year, this.month, number);
    }
  }, {
    key: "getFirstDate",
    value: function getFirstDate() {
      return getDateByDayNumber(1);
    }
  }, {
    key: "getFirstDayOfMonthIndex",
    value: function getFirstDayOfMonthIndex() {
      return this.getFirstDate().getDate();
    }
  }, {
    key: "getDaysCount",
    value: function getDaysCount() {
      return new Date(this.year, this.month + 1, 0).getDate();
    }
  }, {
    key: "createRow",
    value: function createRow() {
      var rowElement = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.createElement)("<div class=\"calendar__row\">\n          <span class=\"calendar__row-item\" data-day-index=\"1\"></span>\n          <span class=\"calendar__row-item\" data-day-index=\"2\"></span>\n          <span class=\"calendar__row-item\" data-day-index=\"3\"></span>\n          <span class=\"calendar__row-item\" data-day-index=\"4\"></span>\n          <span class=\"calendar__row-item\" data-day-index=\"5\"></span>\n          <span class=\"calendar__row-item\" data-day-index=\"6\"></span>\n          <span class=\"calendar__row-item\" data-day-index=\"0\"></span>\n        <div>");
      return rowElement;
    }
  }, {
    key: "createRowItem",
    value: function createRowItem() {
      var rowElement = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.createElement)("");
    }
  }]);
}();

/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COLORS_KEY_LOCALSTORAGE: () => (/* binding */ COLORS_KEY_LOCALSTORAGE),
/* harmony export */   DAYOFF: () => (/* binding */ DAYOFF),
/* harmony export */   HOLLYDAY_SHIFT: () => (/* binding */ HOLLYDAY_SHIFT),
/* harmony export */   MONTHS_COUNT: () => (/* binding */ MONTHS_COUNT),
/* harmony export */   MONTH_MAP: () => (/* binding */ MONTH_MAP),
/* harmony export */   NON_WORKING_DAY: () => (/* binding */ NON_WORKING_DAY),
/* harmony export */   SATURDAY: () => (/* binding */ SATURDAY),
/* harmony export */   SELECTED_USER_KEY_LOCAL_STORAGE: () => (/* binding */ SELECTED_USER_KEY_LOCAL_STORAGE),
/* harmony export */   SUNDAY: () => (/* binding */ SUNDAY),
/* harmony export */   WARNING_MESSAGE: () => (/* binding */ WARNING_MESSAGE),
/* harmony export */   WEEKEND_SHIFT: () => (/* binding */ WEEKEND_SHIFT)
/* harmony export */ });
var MONTHS_COUNT = 12;
var MONTH_MAP = {
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
  11: 'Декабрь'
};
var SATURDAY = 6;
var SUNDAY = 0;
var HOLLYDAY_SHIFT = 'HOLLYDAY_SHIFT';
var WEEKEND_SHIFT = 'WEEKEND_SHIFT';
var NON_WORKING_DAY = 'NON_WORKING_DAY';
var DAYOFF = 'DAYOFF';
var WARNING_MESSAGE = "\u0412\u043D\u0438\u043C\u0430\u043D\u0438\u0435! \u0414\u0430\u043D\u043D\u044B\u0435 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0433\u043E \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044F \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u043B\u0438\u0441\u044C! \u041D\u0435\u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043F\u0440\u0430\u0437\u0434\u043D\u0438\u0447\u043D\u044B\u0435 \u0431\u0443\u0434\u043D\u0438\u0435 \u0434\u043D\u0438 \u0431\u0443\u0434\u0443\u0442 \u0441\u0447\u0438\u0442\u0430\u0442\u044C\u0441\u044F \u0440\u0430\u0431\u043E\u0447\u0438\u043C\u0438 \u0434\u043D\u044F\u043C\u0438!\n\u041D\u0435\u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0440\u0430\u0431\u043E\u0447\u0438\u0435 \u0441\u0443\u0431\u0431\u043E\u0442\u044B \u0438 \u0432\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u044C\u044F \u0431\u0443\u0434\u0443\u0442 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0442\u044C\u0441\u044F \u043A\u0430\u043A \u043D\u0435\u0440\u0430\u0431\u043E\u0447\u0438\u0435.";
var COLORS_KEY_LOCALSTORAGE = 'schedule-days-colors';
var SELECTED_USER_KEY_LOCAL_STORAGE = 'selected-user';

/***/ }),

/***/ "./src/get-production-calendar-info.js":
/*!*********************************************!*\
  !*** ./src/get-production-calendar-info.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getProductionCalendarInfo: () => (/* binding */ getProductionCalendarInfo)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _time_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./time-helpers */ "./src/time-helpers.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


function getProductionCalendarInfo(currentDate) {
  var promiseCollection = [];
  var getNextMonthDateFromCurrent = (0,_time_helpers__WEBPACK_IMPORTED_MODULE_1__.getDateIteratorByMonthIndex)(currentDate);
  for (var i = 0; i < _constants_js__WEBPACK_IMPORTED_MODULE_0__.MONTHS_COUNT; i++) {
    var date = getNextMonthDateFromCurrent(i);
    var url = "https://isdayoff.ru/api/getdata?year=".concat(date.getFullYear(), "&month=").concat(date.getMonth() + 1);
    promiseCollection.push(fetch(url).then(function (res) {
      return res.text();
    }));
  }
  return Promise.all(promiseCollection).then(function (results) {
    var getNextMonthDateFromCurrent = (0,_time_helpers__WEBPACK_IMPORTED_MODULE_1__.getDateIteratorByMonthIndex)(currentDate);
    return results.reduce(function (acc, res, index) {
      var date = getNextMonthDateFromCurrent(index);
      var info = res.split('');
      var result = info.reduce(function (acc, item, index) {
        date.setDate(index + 1);
        acc[(0,_time_helpers__WEBPACK_IMPORTED_MODULE_1__.formatDate)(date)] = !+item;
        return acc;
      }, {});
      return _objectSpread(_objectSpread({}, acc), result);
    }, {});
  });
}

/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createElement: () => (/* binding */ createElement),
/* harmony export */   declOfNum: () => (/* binding */ declOfNum)
/* harmony export */ });
var createElement = function createElement(template) {
  var container = document.createElement('template');
  container.innerHTML = template;
  return container.content.firstElementChild;
};
function declOfNum(number, titles) {
  var cases = [2, 0, 1, 1, 1, 2];
  return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
}

/***/ }),

/***/ "./src/legend/legend.js":
/*!******************************!*\
  !*** ./src/legend/legend.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Legend: () => (/* binding */ Legend)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ "./src/helpers.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var GRADIENT_PERCENT = '70%';
var ADDITIONAL_ITEMS = [{
  description: 'Смена в праздничный день',
  id: _constants__WEBPACK_IMPORTED_MODULE_0__.HOLLYDAY_SHIFT
}, {
  description: 'Смена в субботу или воскресенье',
  id: _constants__WEBPACK_IMPORTED_MODULE_0__.WEEKEND_SHIFT
}, {
  description: 'Нерабочие дни',
  id: _constants__WEBPACK_IMPORTED_MODULE_0__.NON_WORKING_DAY
}];
var Legend = /*#__PURE__*/function () {
  function Legend(schedule, colors) {
    _classCallCheck(this, Legend);
    this.colors = colors;
    this.schedule = schedule;
    this.template = this.getTemplate();
    this.element = this.getElement(this.template);
    this.pickers = [];
    this.init();
  }
  return _createClass(Legend, [{
    key: "init",
    value: function init() {
      var _this$element;
      this.pickers = this.getItems();
      (_this$element = this.element).append.apply(_this$element, _toConsumableArray(this.pickers));
      // container.append(this.element);
    }
  }, {
    key: "setChangeCallback",
    value: function setChangeCallback() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      this.element.addEventListener('change', function (e) {
        var picker = e.target;
        callback({
          id: picker.dataset.scheduleDayIndex,
          value: picker.value
        });
      });
    }
  }, {
    key: "getItems",
    value: function getItems() {
      var _this = this;
      var map = this.schedule.reduce(function (acc, scheduleDay) {
        var dayId = scheduleDay.dayId;
        acc.set(dayId, _this.getItem(scheduleDay));
        return acc;
      }, new Map());
      var additionalItems = ADDITIONAL_ITEMS.map(function (_ref) {
        var description = _ref.description,
          id = _ref.id;
        return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.createElement)(_this.getItemTemplate({
          id: id,
          description: description
        }));
      });
      var result = [].concat(_toConsumableArray(map.values()), _toConsumableArray(additionalItems));
      return result;
    }
  }, {
    key: "getItem",
    value: function getItem(scheduleDay) {
      var name = scheduleDay.name,
        isShiftPart = scheduleDay.isShiftPart,
        isShift = scheduleDay.isShift,
        isLastShiftPart = scheduleDay.isLastShiftPart,
        beginShiftTime = scheduleDay.beginShiftTime,
        endShiftTime = scheduleDay.endShiftTime,
        dayId = scheduleDay.dayId;
      var message = "".concat(name[0].toUpperCase() + name.slice(1));
      if (isShiftPart || isShift) {
        message += " c ".concat(beginShiftTime);
      }
      if (isLastShiftPart || isShift) {
        message += " \u0434\u043E ".concat(endShiftTime);
      }
      return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.getItemTemplate({
        id: dayId,
        description: message
      }));
    }
  }, {
    key: "getItemTemplate",
    value: function getItemTemplate(_ref2) {
      var id = _ref2.id,
        description = _ref2.description;
      return "<div class=\"legend__item\">\n          <input type=\"color\" class=\"legend__icon\" value=\"".concat(this.colors[id], "\" data-schedule-day-index=").concat(id, "> - ").concat(description, " \n        </div>");
    }
  }, {
    key: "getTemplate",
    value: function getTemplate() {
      return "<div class=\"legend content__item\">\n            <div class=\"legend__header\">\u041B\u0435\u0433\u0435\u043D\u0434\u0430</div>\n        </div>";
    }
  }, {
    key: _constants__WEBPACK_IMPORTED_MODULE_0__.HOLLYDAY_SHIFT,
    get: function get() {
      return this.colors[_constants__WEBPACK_IMPORTED_MODULE_0__.HOLLYDAY_SHIFT] || 'pink';
    }
  }, {
    key: _constants__WEBPACK_IMPORTED_MODULE_0__.WEEKEND_SHIFT,
    get: function get() {
      return this.colors[_constants__WEBPACK_IMPORTED_MODULE_0__.WEEKEND_SHIFT] || 'blue';
    }
  }, {
    key: _constants__WEBPACK_IMPORTED_MODULE_0__.NON_WORKING_DAY,
    get: function get() {
      return this.colors[_constants__WEBPACK_IMPORTED_MODULE_0__.NON_WORKING_DAY] || 'red';
    }
  }, {
    key: "getColor",
    value: function getColor(_ref3) {
      var isShiftPart = _ref3.isShiftPart,
        isLastShiftPart = _ref3.isLastShiftPart,
        isShift = _ref3.isShift,
        dayOff = _ref3.dayOff,
        isWorkingDay = _ref3.isWorkingDay,
        isHollyDay = _ref3.isHollyDay,
        isWeekEnd = _ref3.isWeekEnd,
        dayId = _ref3.dayId;
      var mainColor = this.colors[dayId];

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
      if ((isWeekEnd && dayOff || isHollyDay) && isWorkingDay === false) {
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
  }, {
    key: "getGradient",
    value: function getGradient(startColor, endColor) {
      var percent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : GRADIENT_PERCENT;
      return "linear-gradient(to bottom right, ".concat(startColor, " ").concat(percent, ", ").concat(endColor, " ").concat(GRADIENT_PERCENT, " 100%)");
    }
  }, {
    key: "getIconGradiend",
    value: function getIconGradiend(endColor) {
      return this.getGradient('white', endColor, '40%');
    }
  }, {
    key: "getElement",
    value: function getElement(template) {
      return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.createElement)(template);
      // <p class="legend__item"><b class="legend__asterisk">*</b> - Вечером будет пить</p>
      // <p class="legend__item"><b class="legend__asterisk">**</b> - Возможно будет пить с обеда</p>
    }
  }]);
}();

/***/ }),

/***/ "./src/schedule-bulder/schedule-builder.js":
/*!*************************************************!*\
  !*** ./src/schedule-bulder/schedule-builder.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScheduleBuilder: () => (/* binding */ ScheduleBuilder)
/* harmony export */ });
/* harmony import */ var _time_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../time-helpers */ "./src/time-helpers.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var PERIOD_ID = {
  SHIFT: 0,
  SHIFT_ENDED: 1,
  DAY_OFF: 2,
  BEFORE_SHIFT: 3
};
function getScheduleDayWithTime(currentDay, scheduleDay) {
  var _getTimeOfDate = (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getTimeOfDate)(currentDay),
    hours = _getTimeOfDate.hours,
    minutes = _getTimeOfDate.minutes,
    seconds = _getTimeOfDate.seconds;
  var scheduleDateWithTime = new Date(scheduleDay.currentDate.valueOf());
  scheduleDateWithTime.setHours(hours);
  scheduleDateWithTime.setMinutes(minutes);
  scheduleDateWithTime.setSeconds(seconds);
  return _objectSpread(_objectSpread({}, scheduleDay), {}, {
    scheduleDateWithTime: scheduleDateWithTime,
    chosenDay: currentDay
  });
}
var DAY_OF_WEEK_MAP = {
  0: 'воскресенья',
  1: 'понедельника',
  2: 'вторника',
  3: 'среды',
  4: 'четверга',
  5: 'пятницы',
  6: 'субботы'
};
var ScheduleBuilder = /*#__PURE__*/function () {
  function ScheduleBuilder(scheduleInfo, productionCalendarInfo) {
    _classCallCheck(this, ScheduleBuilder);
    this.productionCalendarInfo = productionCalendarInfo;
    this.schedule = this.createSchedule(scheduleInfo);
  }
  return _createClass(ScheduleBuilder, [{
    key: "createSchedule",
    value: function createSchedule(shiftList) {
      var days = new Map();
      var index = -1;
      shiftList.forEach(function (_ref) {
        var name = _ref.name,
          _ref$value = _slicedToArray(_ref.value, 2),
          begin = _ref$value[0],
          end = _ref$value[1],
          _ref$dayOff = _ref.dayOff,
          dayOff = _ref$dayOff === void 0 ? false : _ref$dayOff;
        var numberDayOfBeginning = (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getDayNumberSinceStartYear)(begin);
        var numberDayOfEnding = (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getDayNumberSinceStartYear)(end);
        var beginShiftTime = (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getStringTimeBySeconds)((0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getTimeInSeconds)(begin), true);
        var endShiftTime = (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getStringTimeBySeconds)((0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getTimeInSeconds)(end), true);
        var hasAfewDays = numberDayOfBeginning !== numberDayOfEnding;
        var dayCount = numberDayOfEnding - numberDayOfBeginning + 1;
        var isPart = hasAfewDays && !dayOff;
        var dateOfDays = _defineProperty({
          0: begin
        }, dayCount - 1, end);
        for (var i = 0; i < dayCount; i++) {
          var dateOfDay = dateOfDays[i] || (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getDateWithoutTime)(begin, i);
          var isShiftPart = isPart && i !== dayCount - 1;
          var isLastShiftPart = isPart && i === dayCount - 1;
          var isShift = !isShiftPart && !isLastShiftPart && !dayOff;
          index = index + 1;
          var scheduleDay = {
            index: index,
            dayId: dayOff ? _constants__WEBPACK_IMPORTED_MODULE_1__.DAYOFF : index,
            begin: begin,
            currentDate: dateOfDay,
            end: end,
            name: name,
            isShift: isShift,
            isLastShiftPart: isLastShiftPart,
            isShiftPart: isShiftPart,
            dayOff: dayOff,
            numberDay: (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getDayNumberSinceStartYear)(dateOfDay),
            beginShiftTime: beginShiftTime,
            endShiftTime: endShiftTime
          };
          days.set((0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.formatDate)(dateOfDay), scheduleDay);
        }
      });
      return _toConsumableArray(days.values());
    }
  }, {
    key: "getPeriodIdByDate",
    value: function getPeriodIdByDate(date, currentDay) {
      var scheduleDay = this.getScheduleDayByDate(date);
      var id = this.getPeriodId(scheduleDay, currentDay);
      return id;
    }
  }, {
    key: "getPeriodId",
    value: function getPeriodId(scheduleDay) {
      var currentDay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var scheduleDateWithTime = scheduleDay.scheduleDateWithTime,
        end = scheduleDay.end,
        begin = scheduleDay.begin,
        dayOff = scheduleDay.dayOff;
      var beginShift = +begin / 1000;
      var endShift = +end / 1000;
      var currentTime = scheduleDateWithTime / 1000;
      var periodId = null;
      if (currentDay && !dayOff && currentTime >= endShift) {
        periodId = PERIOD_ID.SHIFT_ENDED;
      } else if (currentDay && !dayOff && currentTime < beginShift) {
        periodId = PERIOD_ID.BEFORE_SHIFT;
      } else if (!dayOff) {
        periodId = PERIOD_ID.SHIFT;
      } else {
        periodId = PERIOD_ID.DAY_OFF;
      }
      return periodId;
    }
  }, {
    key: "getMessageByDate",
    value: function getMessageByDate(date, forToday) {
      var scheduleDay = this.getScheduleDayByDate(date);
      var id = this.getPeriodId(scheduleDay, forToday);
      return this.getMessage(id, scheduleDay, forToday);
    }
  }, {
    key: "getMessage",
    value: function getMessage(id, scheduleDay, currentDay) {
      var beginShiftTime = scheduleDay.beginShiftTime,
        endShiftTime = scheduleDay.endShiftTime,
        name = scheduleDay.name,
        isShiftPart = scheduleDay.isShiftPart,
        isLastShiftPart = scheduleDay.isLastShiftPart,
        chosenDay = scheduleDay.chosenDay;
      var dayOfWeek = chosenDay.getDay();
      var nextScheduleDay = this.getNexScheduleDay(scheduleDay);
      var beginMessageNotWhileShift = 'В этот день';
      var beginMessage = "".concat(currentDay ? 'Идёт' : beginMessageNotWhileShift);
      var partMessage = nextScheduleDay.dayOff ? 'Следующий день - выходной.' : "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0434\u0435\u043D\u044C - ".concat(nextScheduleDay.name, " \u0441 ").concat(nextScheduleDay.beginShiftTime, ".");
      switch (id) {
        case PERIOD_ID.SHIFT:
          {
            var prevDay = dayOfWeek === _constants__WEBPACK_IMPORTED_MODULE_1__.SUNDAY ? _constants__WEBPACK_IMPORTED_MODULE_1__.SATURDAY : dayOfWeek - 1;
            var nextDay = dayOfWeek === _constants__WEBPACK_IMPORTED_MODULE_1__.SATURDAY ? _constants__WEBPACK_IMPORTED_MODULE_1__.SUNDAY : dayOfWeek + 1;
            var firstShiftDay = isShiftPart ? '' : "\u043F\u0440\u043E\u0448\u043B\u043E\u0433\u043E \u0434\u043D\u044F (".concat(DAY_OF_WEEK_MAP[prevDay], ")");
            var secondShiftDay = isLastShiftPart ? '' : " \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0433\u043E \u0434\u043D\u044F (".concat(DAY_OF_WEEK_MAP[nextDay], ")");
            return "".concat(beginMessage, " ").concat(name, " \u0441 ").concat(beginShiftTime, " ").concat(isShiftPart || isLastShiftPart ? firstShiftDay : '', " \u0434\u043E ").concat(endShiftTime).concat(isShiftPart || isLastShiftPart ? secondShiftDay + '.' : '' + '. ' + partMessage);
          }
        case PERIOD_ID.SHIFT_ENDED:
          {
            return "".concat(name[0].toUpperCase() + name.slice(1), " ").concat(currentDay ? 'завершилась' : 'завершается', " \u0432 ").concat(endShiftTime, ". ").concat(partMessage);
          }
        case PERIOD_ID.BEFORE_SHIFT:
          {
            return "".concat(beginMessageNotWhileShift, " ").concat(name, " \u043D\u0430\u0447\u043D\u0451\u0442\u0441\u044F \u0441 ").concat(beginShiftTime, " \u0434\u043E ").concat(endShiftTime, " ").concat(isShiftPart ? 'следующего' : 'текущего', " \u0434\u043D\u044F.");
          }
        case PERIOD_ID.DAY_OFF:
          {
            return "".concat(beginMessageNotWhileShift, " ").concat(name, ". ").concat(partMessage);
          }
      }
    }
  }, {
    key: "getShiftDescriptionByDate",
    value: function getShiftDescriptionByDate(date) {
      var id = this.getPeriodIdByDate(date, true);
      var message = "\u0421\u043C\u0435\u043D\u0430 ".concat(id === PERIOD_ID.SHIFT ? 'заканчивается' : 'начинается', " \u0447\u0435\u0440\u0435\u0437:");
      return message;
    }
  }, {
    key: "getTimerValueByDate",
    value: function getTimerValueByDate(date, currentDay) {
      var scheduleDay = this.getScheduleDayByDate(date);
      var id = this.getPeriodId(scheduleDay, currentDay);
      var timerValue = this.getTimerValue(id, scheduleDay);
      return timerValue;
    }
  }, {
    key: "getTimerValue",
    value: function getTimerValue(id, scheduleDay) {
      var scheduleDateWithTime = scheduleDay.scheduleDateWithTime,
        end = scheduleDay.end,
        begin = scheduleDay.begin;
      var beginShift = +begin / 1000;
      var endShift = +end / 1000;
      var currentTime = scheduleDateWithTime / 1000;
      switch (id) {
        case PERIOD_ID.SHIFT_ENDED:
        case PERIOD_ID.DAY_OFF:
          {
            var nextShiftBegin = this.getNexScheduleDay(scheduleDay, function (nextDay) {
              return !nextDay.dayOff && !nextDay.isLastShiftPart;
            }).begin / 1000;
            return nextShiftBegin - currentTime; // счётчик до начала смены
          }
        case PERIOD_ID.BEFORE_SHIFT:
          {
            return beginShift - currentTime; // счётчик до начала смены
          }
        case PERIOD_ID.SHIFT:
          {
            return endShift - currentTime; // счётчик до конца смены
          }
      }
    }
  }, {
    key: "getScheduleDayByDate",
    value: function getScheduleDayByDate(date) {
      var _this$productionCalen, _this$productionCalen2;
      var infoLength = this.schedule.length;
      var dayNumberSinceStartYear = (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getDayNumberSinceStartYear)(date);
      var scheduleDay = this.schedule.find(function (dayInfo) {
        return (dayNumberSinceStartYear - dayInfo.numberDay) % infoLength === 0;
      });
      var dayOfWeek = date.getDay();
      var isWeekEnd = dayOfWeek === _constants__WEBPACK_IMPORTED_MODULE_1__.SATURDAY || dayOfWeek === _constants__WEBPACK_IMPORTED_MODULE_1__.SUNDAY;
      var isWorkingDay = (_this$productionCalen = (_this$productionCalen2 = this.productionCalendarInfo) === null || _this$productionCalen2 === void 0 ? void 0 : _this$productionCalen2[(0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.formatDate)(date)]) !== null && _this$productionCalen !== void 0 ? _this$productionCalen : !isWeekEnd;
      var isHollyDay = !isWorkingDay && !isWeekEnd;
      return getScheduleDayWithTime(date, _objectSpread(_objectSpread({}, scheduleDay), {}, {
        isWorkingDay: isWorkingDay,
        isHollyDay: isHollyDay,
        isWeekEnd: isWeekEnd
      }));
    }
  }, {
    key: "getNexScheduleDay",
    value: function getNexScheduleDay(scheduleDay, conditionCallback) {
      var list = _toConsumableArray(this.schedule.values());
      var index = scheduleDay.index;
      while (true) {
        if (index === list.length) index = -1;
        var nextScheduleDay = list[++index];
        if (nextScheduleDay && (typeof conditionCallback !== 'function' || conditionCallback(nextScheduleDay))) {
          if (scheduleDay.begin > nextScheduleDay.begin) {
            var begin = new Date(+nextScheduleDay.begin);
            var end = new Date(+nextScheduleDay.end);
            begin.setDate(begin.getDate() + list.length);
            end.setDate(end.getDate() + list.length);
            return _objectSpread(_objectSpread({}, nextScheduleDay), {}, {
              begin: begin,
              end: end
            });
          }
          return nextScheduleDay;
        }
      }
    }
  }]);
}();

/***/ }),

/***/ "./src/time-helpers.js":
/*!*****************************!*\
  !*** ./src/time-helpers.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatDate: () => (/* binding */ formatDate),
/* harmony export */   getDateIteratorByMonthIndex: () => (/* binding */ getDateIteratorByMonthIndex),
/* harmony export */   getDateWithoutTime: () => (/* binding */ getDateWithoutTime),
/* harmony export */   getDayNumberSinceStartYear: () => (/* binding */ getDayNumberSinceStartYear),
/* harmony export */   getStringTimeByDate: () => (/* binding */ getStringTimeByDate),
/* harmony export */   getStringTimeBySeconds: () => (/* binding */ getStringTimeBySeconds),
/* harmony export */   getTimeInSeconds: () => (/* binding */ getTimeInSeconds),
/* harmony export */   getTimeOfDate: () => (/* binding */ getTimeOfDate),
/* harmony export */   padTo2Digits: () => (/* binding */ padTo2Digits),
/* harmony export */   parseSecondForTimer: () => (/* binding */ parseSecondForTimer)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var HOURS_IN_DAY = 24;
var daysNumberDescription = ['день', 'дня', 'дней'];
var padTo2Digits = function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
};
var formatDate = function formatDate(date) {
  return [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join('-');
};
var padNumbersTo2Digits = function padNumbersTo2Digits(list) {
  return list.map(function (item) {
    return padTo2Digits(item);
  }).join(':');
};
function getStringTimeBySeconds(secondsNumber) {
  var withoutSeconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var value = parseSecondForTimer(secondsNumber, withoutSeconds);
  var _value = _slicedToArray(value, 3),
    hours = _value[0],
    minutes = _value[1],
    seconds = _value[2];
  if (hours < HOURS_IN_DAY) {
    return padNumbersTo2Digits(value);
  }
  var daysNumber = Math.floor(hours / HOURS_IN_DAY);
  var lastHours = hours - daysNumber * 24;
  return "".concat(daysNumber, " ").concat((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.declOfNum)(daysNumber, daysNumberDescription), " ").concat(padNumbersTo2Digits([lastHours, minutes, seconds]));
}
var getDayNumberSinceStartYear = function getDayNumberSinceStartYear(date) {
  var startedTime = +new Date(2022, 0, 1);
  var diff = +date - startedTime;
  return Math.floor(diff / 1000 / 60 / 60 / 24);
};
function getTimeInSeconds(date) {
  var _getTimeOfDate = getTimeOfDate(date),
    hours = _getTimeOfDate.hours,
    minutes = _getTimeOfDate.minutes,
    seconds = _getTimeOfDate.seconds;
  var timeInSeconds = hours * 60 * 60 + minutes * 60 + seconds;
  return timeInSeconds;
}
function getStringTimeByDate(date) {
  var _getTimeOfDate2 = getTimeOfDate(date),
    hours = _getTimeOfDate2.hours,
    minutes = _getTimeOfDate2.minutes,
    seconds = _getTimeOfDate2.seconds;
  return [hours, minutes, seconds].map(function (item) {
    return padTo2Digits(item);
  }).join(':');
}
function parseSecondForTimer(secondsNumber, withoutSeconds) {
  var hours = Math.floor(secondsNumber / (60 * 60));
  var minutes = Math.floor((secondsNumber - hours * 60 * 60) / 60);
  var seconds = !withoutSeconds ? secondsNumber - (hours * 60 * 60 + minutes * 60) : 0;
  return [hours, minutes].concat(!withoutSeconds ? seconds : []);
}
function getTimeOfDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}
function getDateWithoutTime(date) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var day = new Date(date.valueOf());
  day.setDate(day.getDate() + offset);
  day.setHours(0);
  day.setMinutes(0);
  day.setSeconds(0);
  return day;
}
function getDateIteratorByMonthIndex(currentDate) {
  var currentMonth = currentDate.getMonth();
  var currentYear = currentDate.getFullYear();
  return function (i) {
    var date = new Date(+currentDate);
    date.setYear(currentYear);
    date.setMonth(currentMonth + i);
    return date;
  };
}

/***/ }),

/***/ "./src/user-selector.js":
/*!******************************!*\
  !*** ./src/user-selector.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserSelector: () => (/* binding */ UserSelector)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var UserSelector = /*#__PURE__*/function () {
  function UserSelector(users) {
    _classCallCheck(this, UserSelector);
    this.users = users;
    this.element = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createElement)(this.getTemplate());
    this.select = this.element.querySelector('.user-selector__select');
  }
  return _createClass(UserSelector, [{
    key: "setValue",
    value: function setValue(value) {
      this.select.value = value;
    }
  }, {
    key: "setChangeListener",
    value: function setChangeListener(callback) {
      this.element.addEventListener('change', function (e) {
        callback(e.target.value);
      });
    }
  }, {
    key: "init",
    value: function init(container) {
      container.append(this.element);
    }
  }, {
    key: "getTemplate",
    value: function getTemplate() {
      return "<div class=\"user-selector\">\n          <select class=\"user-selector__select\" name=\"user\">\n            <option disabled>\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u0430</option>\n            ".concat(this.users.map(function (item, index) {
        return "<option value=\"".concat(index, "\">").concat(item.name, "</option>");
      }).join(), "\n          </select>\n        </div>");
    }
  }]);
}();

/***/ }),

/***/ "./src/users/index.js":
/*!****************************!*\
  !*** ./src/users/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   users: () => (/* binding */ users)
/* harmony export */ });
var users = [{
  name: 'Пескарь',
  scheduleInfo: [{
    name: 'дневная смена',
    value: [new Date(2022, 6, 20, 8, 0, 0, 0), new Date(2022, 6, 20, 20, 0, 0, 0)]
  }, {
    name: 'ночная смена',
    value: [new Date(2022, 6, 21, 20, 0, 0, 0), new Date(2022, 6, 22, 8, 0, 0, 0)]
  }, {
    name: 'выходной',
    value: [new Date(2022, 6, 23, 20, 0, 0, 0), new Date(2022, 6, 23, 0, 0, 0, 0)],
    dayOff: true
  }]
}, {
  name: '(для теста)',
  scheduleInfo: [{
    name: 'Первая смена',
    value: [new Date(2022, 4, 16, 8, 0, 0, 0), new Date(2022, 4, 17, 8, 0, 0, 0)]
  }, {
    name: 'выходной',
    value: [new Date(2022, 4, 18, 0, 0, 0, 0), new Date(2022, 4, 18, 0, 0, 0, 0)],
    dayOff: true
  }, {
    name: 'Вторая смена',
    value: [new Date(2022, 4, 19, 8, 0, 0, 0), new Date(2022, 4, 20, 8, 0, 0, 0)]
  }, {
    name: 'Выходной',
    value: [new Date(2022, 4, 21, 0, 0, 0, 0), new Date(2022, 4, 22, 0, 0, 0, 0)],
    dayOff: true
  }]
}];

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles.css":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles.css ***!
  \**************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
    --border: 3px solid gray;
}

.container {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
}

.container__item {
    box-sizing: border-box;
    max-width: 600px;
    padding: 20px;
    border-radius: 30px;
    border: var(--border);
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
}

.content {
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-size: 25px;
    font-family: sans-serif;
}

.content__item {
    border: var(--border);
    padding: 10px 15px;
    margin-bottom: 20px;
}

.fieldset {
    border: var(--border);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 5px;
}

.fieldset__item {
    margin: 5px;
    font-size: 25px;
    border: var(--border);
    border-radius: 30px;
    padding: 2px 10px;
}

.calendar {
    margin-bottom: 15px;
}

.calendar__header {
    text-align: center;
    margin: 0;
}

.calendar__content {
    border: var(--border);
}

.calendar__row {
    display: flex;
    justify-content: space-around;
    flex-wrap: nowrap;
    cursor: pointer;
    min-height: 35px;
}

.calendar__row--main {
    cursor: auto;
}

.calendar__row-item {
    border: 1px solid gray;
    flex: 1 1 0px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.calendar__row-item--weekend {
    background-color: red;
}

.legend {
    font-size: 15px;
    border: var(--border);
    border-radius: 30px;
    padding: 20px;
}

.legend__header {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
}

.legend__item {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    margin: 5px;
}

.legend__icon {
    display: inline-block;
    height: 30px;
    margin-right: 10px;
    border: none;
    padding: 0;
    box-shadow: none;
    flex-basis: 40px;
    flex-grow: 0;
    flex-shrink: 0;
}

.warning-message {
    font-size: 20px;
    padding: 15px;
    color: red;
    border: var(--border);
    border-radius: 30px;
}

.user-selector-container {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-selector__select {
    font-size: 30px;
    text-align: center;
    border: 2px solid gray;
}

.hidden-element {
    display: none;
}
`, "",{"version":3,"sources":["webpack://./src/styles.css"],"names":[],"mappings":"AAAA;IACI,wBAAwB;AAC5B;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,cAAc;IACd,uBAAuB;IACvB,mBAAmB;IACnB,YAAY;AAChB;;AAEA;IACI,sBAAsB;IACtB,gBAAgB;IAChB,aAAa;IACb,mBAAmB;IACnB,qBAAqB;IACrB,WAAW;IACX,gBAAgB;IAChB,mBAAmB;AACvB;;AAEA;IACI,aAAa;IACb,uBAAuB;IACvB,sBAAsB;IACtB,eAAe;IACf,uBAAuB;AAC3B;;AAEA;IACI,qBAAqB;IACrB,kBAAkB;IAClB,mBAAmB;AACvB;;AAEA;IACI,qBAAqB;IACrB,aAAa;IACb,eAAe;IACf,uBAAuB;IACvB,YAAY;AAChB;;AAEA;IACI,WAAW;IACX,eAAe;IACf,qBAAqB;IACrB,mBAAmB;IACnB,iBAAiB;AACrB;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,kBAAkB;IAClB,SAAS;AACb;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,aAAa;IACb,6BAA6B;IAC7B,iBAAiB;IACjB,eAAe;IACf,gBAAgB;AACpB;;AAEA;IACI,YAAY;AAChB;;AAEA;IACI,sBAAsB;IACtB,aAAa;IACb,aAAa;IACb,uBAAuB;IACvB,mBAAmB;AACvB;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,eAAe;IACf,qBAAqB;IACrB,mBAAmB;IACnB,aAAa;AACjB;;AAEA;IACI,eAAe;IACf,iBAAiB;IACjB,kBAAkB;IAClB,mBAAmB;AACvB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,iBAAiB;IACjB,WAAW;AACf;;AAEA;IACI,qBAAqB;IACrB,YAAY;IACZ,kBAAkB;IAClB,YAAY;IACZ,UAAU;IACV,gBAAgB;IAChB,gBAAgB;IAChB,YAAY;IACZ,cAAc;AAClB;;AAEA;IACI,eAAe;IACf,aAAa;IACb,UAAU;IACV,qBAAqB;IACrB,mBAAmB;AACvB;;AAEA;IACI,gBAAgB;IAChB,aAAa;IACb,mBAAmB;IACnB,uBAAuB;AAC3B;;AAEA;IACI,eAAe;IACf,kBAAkB;IAClB,sBAAsB;AAC1B;;AAEA;IACI,aAAa;AACjB","sourcesContent":[":root {\r\n    --border: 3px solid gray;\r\n}\r\n\r\n.container {\r\n    display: flex;\r\n    flex-direction: column;\r\n    margin: 0 auto;\r\n    justify-content: center;\r\n    align-items: center;\r\n    flex-grow: 1;\r\n}\r\n\r\n.container__item {\r\n    box-sizing: border-box;\r\n    max-width: 600px;\r\n    padding: 20px;\r\n    border-radius: 30px;\r\n    border: var(--border);\r\n    width: 100%;\r\n    margin-top: 10px;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.content {\r\n    display: flex;\r\n    justify-content: center;\r\n    flex-direction: column;\r\n    font-size: 25px;\r\n    font-family: sans-serif;\r\n}\r\n\r\n.content__item {\r\n    border: var(--border);\r\n    padding: 10px 15px;\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.fieldset {\r\n    border: var(--border);\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n    justify-content: center;\r\n    padding: 5px;\r\n}\r\n\r\n.fieldset__item {\r\n    margin: 5px;\r\n    font-size: 25px;\r\n    border: var(--border);\r\n    border-radius: 30px;\r\n    padding: 2px 10px;\r\n}\r\n\r\n.calendar {\r\n    margin-bottom: 15px;\r\n}\r\n\r\n.calendar__header {\r\n    text-align: center;\r\n    margin: 0;\r\n}\r\n\r\n.calendar__content {\r\n    border: var(--border);\r\n}\r\n\r\n.calendar__row {\r\n    display: flex;\r\n    justify-content: space-around;\r\n    flex-wrap: nowrap;\r\n    cursor: pointer;\r\n    min-height: 35px;\r\n}\r\n\r\n.calendar__row--main {\r\n    cursor: auto;\r\n}\r\n\r\n.calendar__row-item {\r\n    border: 1px solid gray;\r\n    flex: 1 1 0px;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n\r\n.calendar__row-item--weekend {\r\n    background-color: red;\r\n}\r\n\r\n.legend {\r\n    font-size: 15px;\r\n    border: var(--border);\r\n    border-radius: 30px;\r\n    padding: 20px;\r\n}\r\n\r\n.legend__header {\r\n    font-size: 20px;\r\n    font-weight: bold;\r\n    text-align: center;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.legend__item {\r\n    display: flex;\r\n    align-items: center;\r\n    padding: 5px 10px;\r\n    margin: 5px;\r\n}\r\n\r\n.legend__icon {\r\n    display: inline-block;\r\n    height: 30px;\r\n    margin-right: 10px;\r\n    border: none;\r\n    padding: 0;\r\n    box-shadow: none;\r\n    flex-basis: 40px;\r\n    flex-grow: 0;\r\n    flex-shrink: 0;\r\n}\r\n\r\n.warning-message {\r\n    font-size: 20px;\r\n    padding: 15px;\r\n    color: red;\r\n    border: var(--border);\r\n    border-radius: 30px;\r\n}\r\n\r\n.user-selector-container {\r\n    overflow: hidden;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n.user-selector__select {\r\n    font-size: 30px;\r\n    text-align: center;\r\n    border: 2px solid gray;\r\n}\r\n\r\n.hidden-element {\r\n    display: none;\r\n}\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./styles.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ "./src/styles.css");
/* harmony import */ var _get_production_calendar_info__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./get-production-calendar-info */ "./src/get-production-calendar-info.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var _user_selector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./user-selector */ "./src/user-selector.js");
/* harmony import */ var _users__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./users */ "./src/users/index.js");
/* harmony import */ var _app_app__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app/app */ "./src/app/app.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }






var COLOR = _defineProperty(_defineProperty(_defineProperty(_defineProperty({
  0: '#0CCA4A',
  1: '#ffff00',
  2: '#FFA500',
  3: '#b7be0b',
  4: '#756ad6',
  5: '#18b739',
  6: '#376d9b',
  7: '#2ba8bc',
  8: '#ecd84a',
  9: '#19a9fc'
}, _constants__WEBPACK_IMPORTED_MODULE_2__.WEEKEND_SHIFT, '#5C0029'), _constants__WEBPACK_IMPORTED_MODULE_2__.HOLLYDAY_SHIFT, '#2708A0'), _constants__WEBPACK_IMPORTED_MODULE_2__.NON_WORKING_DAY, '#ff0000'), _constants__WEBPACK_IMPORTED_MODULE_2__.DAYOFF, '#ffffff');
var appContainerElement = document.querySelector('.app-container');
var selectUserContainer = document.querySelector('.user-selector-container');
var localStorageData = localStorage.getItem(_constants__WEBPACK_IMPORTED_MODULE_2__.COLORS_KEY_LOCALSTORAGE);
var selectedUserFromLocalStorage = localStorage.getItem(_constants__WEBPACK_IMPORTED_MODULE_2__.SELECTED_USER_KEY_LOCAL_STORAGE) || 0;
var colors = localStorageData ? _objectSpread(_objectSpread({}, COLOR), JSON.parse(localStorageData)) : COLOR;
var saveHandlers = {
  saveColors: function saveColors(colors) {
    localStorage.setItem(_constants__WEBPACK_IMPORTED_MODULE_2__.COLORS_KEY_LOCALSTORAGE, JSON.stringify(colors));
  }
};
function initApp(index, prodCalendarInfo, message) {
  var scheduleInfo = _users__WEBPACK_IMPORTED_MODULE_4__.users[index].scheduleInfo;
  var app = new _app_app__WEBPACK_IMPORTED_MODULE_5__.App(scheduleInfo, colors, saveHandlers, prodCalendarInfo, message);
  app.init(appContainerElement);
  return app;
}
function startApp(prodCalendarInfo, message) {
  var start = function start(index) {
    return initApp(index, prodCalendarInfo, message);
  };
  var userSelector = new _user_selector__WEBPACK_IMPORTED_MODULE_3__.UserSelector(_users__WEBPACK_IMPORTED_MODULE_4__.users);
  userSelector.setValue(selectedUserFromLocalStorage);
  var app = start(selectedUserFromLocalStorage);
  userSelector.setChangeListener(function (index) {
    app.destroy();
    app = start(index);
    localStorage.setItem(_constants__WEBPACK_IMPORTED_MODULE_2__.SELECTED_USER_KEY_LOCAL_STORAGE, index);
  });
  userSelector.init(selectUserContainer);
}
(0,_get_production_calendar_info__WEBPACK_IMPORTED_MODULE_1__.getProductionCalendarInfo)(new Date()).then(function (prodCalendarInfo) {
  startApp(prodCalendarInfo);
})["catch"](function () {
  startApp(null, _constants__WEBPACK_IMPORTED_MODULE_2__.WARNING_MESSAGE);
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map