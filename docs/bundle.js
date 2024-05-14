/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   App: () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var _time_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./time-helpers */ "./src/time-helpers.js");
/* harmony import */ var _schedule_builder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./schedule-builder */ "./src/schedule-builder.js");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view */ "./src/view.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var App = /*#__PURE__*/function () {
  function App(scheduleInfo) {
    _classCallCheck(this, App);
    this.scheduleBuilder = new _schedule_builder__WEBPACK_IMPORTED_MODULE_1__.ScheduleBuilder(scheduleInfo);
    this.view = new _view__WEBPACK_IMPORTED_MODULE_2__.View();
    this.intervalId = null;
  }
  return _createClass(App, [{
    key: "setListeners",
    value: function setListeners() {
      var _this = this;
      this.view.setChangeDateHandler(function (e) {
        var newDate = new Date(e.target.value);
        var isCurrentDay = (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.formatDate)(newDate) === (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.formatDate)(new Date());
        _this.setInfo(isCurrentDay ? new Date() : (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getDateWithoutTime)(newDate), isCurrentDay);
      });
    }
  }, {
    key: "init",
    value: function init(container) {
      var date = new Date(2024, 4, 16, 8, 1, 0);
      this.setListeners();
      this.setInfo(date, true);
      container === null || container === void 0 || container.append(this.view.element);
    }
  }, {
    key: "setTimer",
    value: function setTimer(date, isCurrentDay) {
      var _this2 = this;
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
        var newDate = date;
        date.setSeconds(date.getSeconds() + 1);
        secondsNumber = _this2.scheduleBuilder.getTimerValueByDate(newDate, isCurrentDay);
        _this2.view.setTimerValue(secondsNumber);
        _this2.view.setCurrentTime(date, isCurrentDay);
        if (!secondsNumber || day && newDate.getDate() !== day) {
          _this2.setInfo(date, true);
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
  }]);
}();

/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createElement: () => (/* binding */ createElement),
/* harmony export */   formatDate: () => (/* binding */ formatDate),
/* harmony export */   getDayNumberSinceStartYear: () => (/* binding */ getDayNumberSinceStartYear),
/* harmony export */   padTo2Digits: () => (/* binding */ padTo2Digits)
/* harmony export */ });
var getDayNumberSinceStartYear = function getDayNumberSinceStartYear(date) {
  var year = date.getFullYear();
  var startedTime = +new Date(2022, 0, 1);
  var diff = +date - startedTime;
  return Math.floor(diff / 1000 / 60 / 60 / 24);
};
var padTo2Digits = function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
};
var formatDate = function formatDate(date) {
  return [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join('-');
};
var createElement = function createElement(template) {
  var container = document.createElement('template');
  container.innerHTML = template;
  return container.content.firstElementChild;
};

/***/ }),

/***/ "./src/schedule-builder.js":
/*!*********************************!*\
  !*** ./src/schedule-builder.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScheduleBuilder: () => (/* binding */ ScheduleBuilder)
/* harmony export */ });
/* harmony import */ var _time_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./time-helpers */ "./src/time-helpers.js");
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
    scheduleDateWithTime: scheduleDateWithTime
  });
}
var ScheduleBuilder = /*#__PURE__*/function () {
  function ScheduleBuilder(scheduleInfo) {
    _classCallCheck(this, ScheduleBuilder);
    this.schedule = this.createSchedule(scheduleInfo);
  }
  return _createClass(ScheduleBuilder, [{
    key: "createSchedule",
    value: function createSchedule(shiftList) {
      var days = new Map();
      var index = 0;
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
          days.set((0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.formatDate)(dateOfDay), {
            index: index++,
            begin: begin,
            currentDate: dateOfDay,
            end: end,
            name: name,
            isShiftPart: isPart && i !== dayCount - 1,
            isLastShiftPart: isPart && i === dayCount - 1,
            dayOff: dayOff,
            numberDay: (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getDayNumberSinceStartYear)(dateOfDay),
            beginShiftTime: beginShiftTime,
            endShiftTime: endShiftTime
          });
        }
      });
      return days;
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
        isShiftPart = scheduleDay.isShiftPart;
      var nextScheduleDay = this.getNexScheduleDay(scheduleDay);
      var beginMessageNotWhileShift = 'В этот день';
      var beginMessage = "".concat(currentDay ? 'Идёт' : beginMessageNotWhileShift);
      var partMessage = nextScheduleDay.dayOff ? 'Следующий день - выходной.' : "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0434\u0435\u043D\u044C - ".concat(nextScheduleDay.name, " \u0441\u043C\u0435\u043D\u0430 \u0441 ").concat(nextScheduleDay.beginShiftTime, ".");
      switch (id) {
        case PERIOD_ID.SHIFT_ENDED:
          {
            return "".concat(name[0].toUpperCase() + name.slice(1), " \u0441\u043C\u0435\u043D\u0430 ").concat(currentDay ? 'завершилась' : 'завершается', " \u0432 ").concat(endShiftTime, ". ").concat(partMessage);
          }
        case PERIOD_ID.SHIFT:
          {
            return "".concat(beginMessage, " ").concat(name, " c\u043C\u0435\u043D\u0430 \u0441 ").concat(beginShiftTime, " \u0434\u043E ").concat(endShiftTime).concat(isShiftPart ? ' следующего дня.' : '. ' + partMessage);
          }
        case PERIOD_ID.BEFORE_SHIFT:
          {
            return "".concat(beginMessageNotWhileShift, " ").concat(name, " \u0441\u043C\u0435\u043D\u0430 \u043D\u0430\u0447\u043D\u0451\u0442\u0441\u044F \u0441 ").concat(beginShiftTime, " \u0434\u043E ").concat(endShiftTime, " ").concat(isShiftPart ? 'следующего' : 'текущего', " \u0434\u043D\u044F.");
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
      var infoLength = this.schedule.size;
      var dayNumberSinceStartYear = (0,_time_helpers__WEBPACK_IMPORTED_MODULE_0__.getDayNumberSinceStartYear)(date);
      var scheduleDay = _toConsumableArray(this.schedule.values()).find(function (dayInfo) {
        return (dayNumberSinceStartYear - dayInfo.numberDay) % infoLength === 0;
      });
      return getScheduleDayWithTime(date, scheduleDay);
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

/***/ "./src/templates.js":
/*!**************************!*\
  !*** ./src/templates.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   appTemplate: () => (/* binding */ appTemplate)
/* harmony export */ });
var appTemplate = "<form class=\"content\">\n  <fieldset class=\"fieldset\">\n    <legend>\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0430\u0442\u0443</legend>\n    <input type=\"date\" class=\"js-calendar calendar\" /> \n    <span class=\"js-day-of-week day-of-week\"></span>\n    <span class=\"js-current-time current-time\"></span>\n  </fieldset>\n  <div class=\"js-chosen-day-info chosen-day-info\"></div>\n  <fieldset class=\"fieldset js-timer-fieldset\">\n  <legend></legend>\n    <div class=\"js-timer-container timer-container\"></div>\n  </fieldset>\n  \n</form>";

/***/ }),

/***/ "./src/time-helpers.js":
/*!*****************************!*\
  !*** ./src/time-helpers.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatDate: () => (/* binding */ formatDate),
/* harmony export */   getDateWithoutTime: () => (/* binding */ getDateWithoutTime),
/* harmony export */   getDayNumberSinceStartYear: () => (/* binding */ getDayNumberSinceStartYear),
/* harmony export */   getStringTimeByDate: () => (/* binding */ getStringTimeByDate),
/* harmony export */   getStringTimeBySeconds: () => (/* binding */ getStringTimeBySeconds),
/* harmony export */   getTimeInSeconds: () => (/* binding */ getTimeInSeconds),
/* harmony export */   getTimeOfDate: () => (/* binding */ getTimeOfDate),
/* harmony export */   padTo2Digits: () => (/* binding */ padTo2Digits),
/* harmony export */   parseSecondForTimer: () => (/* binding */ parseSecondForTimer)
/* harmony export */ });
var padTo2Digits = function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
};
var formatDate = function formatDate(date) {
  return [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join('-');
};
function getStringTimeBySeconds(secondsNumber) {
  var withoutSeconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var value = parseSecondForTimer(secondsNumber, withoutSeconds);
  return value.map(function (item) {
    return padTo2Digits(item);
  }).join(':');
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

/***/ }),

/***/ "./src/view.js":
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   View: () => (/* binding */ View)
/* harmony export */ });
/* harmony import */ var _time_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./time-helpers */ "./src/time-helpers.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
/* harmony import */ var _templates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./templates */ "./src/templates.js");
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
    this.element = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.createElement)(_templates__WEBPACK_IMPORTED_MODULE_2__.appTemplate);
    this.calendarElement = this.element.querySelector('.js-calendar');
    this.chosenInfoContainer = this.element.querySelector('.js-chosen-day-info');
    this.timerContainer = this.element.querySelector('.js-timer-container');
    this.timerFieldset = this.element.querySelector('.js-timer-fieldset');
    this.dayOfWeekElement = this.element.querySelector('.js-day-of-week');
    this.currentTimeElement = this.element.querySelector('.js-current-time');
  }
  return _createClass(View, [{
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
  }]);
}();

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
___CSS_LOADER_EXPORT___.push([module.id, `#container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
}
.content {
    border: 3px solid gray;
    padding: 20px;
    display: flex;
    border-radius: 30px;
    justify-content: center;
    flex-direction: column;
    font-size: 25px;
    font-family: sans-serif;
    max-width: 600px;
    margin: 15px;
}
.calendar,
.day-of-week,
.current-time {
    font-size: 25px;
    border: 3px solid gray;
    border-radius: 30px;
    padding-left: 5px;
    padding-right: 5px;
    margin: 5px;
}
.day-of-week,
.current-time {
    border-radius: 30px;
    padding: 2px 10px;
}
.chosen-day-info {
    border: 3px solid gray;
    padding: 10px 15px;
    margin-bottom: 10px;
}
.fieldset {
    border: 3px solid gray;
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
}

.hidden-element {
    display: none;
}
`, "",{"version":3,"sources":["webpack://./src/styles.css"],"names":[],"mappings":"AAAA;IACI,aAAa;IACb,uBAAuB;IACvB,uBAAuB;AAC3B;AACA;IACI,sBAAsB;IACtB,aAAa;IACb,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,sBAAsB;IACtB,eAAe;IACf,uBAAuB;IACvB,gBAAgB;IAChB,YAAY;AAChB;AACA;;;IAGI,eAAe;IACf,sBAAsB;IACtB,mBAAmB;IACnB,iBAAiB;IACjB,kBAAkB;IAClB,WAAW;AACf;AACA;;IAEI,mBAAmB;IACnB,iBAAiB;AACrB;AACA;IACI,sBAAsB;IACtB,kBAAkB;IAClB,mBAAmB;AACvB;AACA;IACI,sBAAsB;IACtB,mBAAmB;IACnB,aAAa;IACb,eAAe;AACnB;;AAEA;IACI,aAAa;AACjB","sourcesContent":["#container {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: flex-start;\r\n}\r\n.content {\r\n    border: 3px solid gray;\r\n    padding: 20px;\r\n    display: flex;\r\n    border-radius: 30px;\r\n    justify-content: center;\r\n    flex-direction: column;\r\n    font-size: 25px;\r\n    font-family: sans-serif;\r\n    max-width: 600px;\r\n    margin: 15px;\r\n}\r\n.calendar,\r\n.day-of-week,\r\n.current-time {\r\n    font-size: 25px;\r\n    border: 3px solid gray;\r\n    border-radius: 30px;\r\n    padding-left: 5px;\r\n    padding-right: 5px;\r\n    margin: 5px;\r\n}\r\n.day-of-week,\r\n.current-time {\r\n    border-radius: 30px;\r\n    padding: 2px 10px;\r\n}\r\n.chosen-day-info {\r\n    border: 3px solid gray;\r\n    padding: 10px 15px;\r\n    margin-bottom: 10px;\r\n}\r\n.fieldset {\r\n    border: 3px solid gray;\r\n    margin-bottom: 20px;\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n}\r\n\r\n.hidden-element {\r\n    display: none;\r\n}\r\n"],"sourceRoot":""}]);
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
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app */ "./src/app.js");


var scheduleInfo = [{
  name: 'дневная',
  value: [new Date(2022, 6, 20, 8, 0, 0, 0), new Date(2022, 6, 20, 20, 0, 0, 0)]
}, {
  name: 'ночная',
  value: [new Date(2022, 6, 21, 20, 0, 0, 0), new Date(2022, 6, 22, 8, 0, 0, 0)]
}, {
  name: 'выходной',
  value: [new Date(2022, 6, 23, 0, 0, 0, 0), new Date(2022, 6, 23, 0, 0, 0, 0)],
  dayOff: true
}];
var app = new _app__WEBPACK_IMPORTED_MODULE_1__.App(scheduleInfo);
app.init(document.querySelector('#container'));
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map