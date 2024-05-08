import { getDayNumberOfYear } from './helpers';

const workingNightNumber = getDayNumberOfYear(new Date(2022, 6, 21, 0, 0, 0, 0));
const workingDayNumber = getDayNumberOfYear(new Date(2022, 6, 20, 0, 0, 0, 0));
const daySummary = 4;
export const isDayWorking = (day) => {
    return (day - workingDayNumber) % daySummary === 0;
};

export const isNightWorking = (day) => {
    return (day - workingNightNumber) % daySummary === 0;
};

export const isFirstDayOff = (day) => {
    return (day - workingDayNumber) % daySummary === 2;
};

export const getWorkingInfo = (date) => {
    const chosenDay = getDayNumberOfYear(date);
    return {
        isDayWorking: isDayWorking(chosenDay),
        isNightWorking: isNightWorking(chosenDay),
        isFirstDayOff: isFirstDayOff(chosenDay),
    };
};

// export const getContentData = (date) => {
//     const { isDayWorking, isNightWorking, isFirstDayOff } = getWorkingInfo(date);
//     const text = 'У Пескаря в этот день';

//     if (isDayWorking) {
//         return text + ' дневная смена. Завтра в ночь, потом два выходных.';
//     } else if (isNightWorking) {
//         return text + ' ночная смена. Потом два выходных.';
//     } else if (isFirstDayOff) {
//         return text + ' первый выходной. Завтра ещё один.';
//     } else {
//         return text + ' второй выходной. Завтра в день на работу.';
//     }
// };
const startDayShift = 8 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const dayShiftLenght = 10 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const endtDayShift = 20 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const startNightShift = 20 /* hours */ * 60 /* minutes */ * 60; /* seconds */
const endNightLength = 8 /* hours */ * 60 /* minutes */ * 60; /* seconds */
export const getContentData2 = (date) => {
    const { isDayWorking, isNightWorking, isFirstDayOff } = getWorkingInfo(date);
    const text = 'У Пескаря в этот день';

    if (isDayWorking) {
        return text + ' дневная смена. Завтра в ночь, потом два выходных.';
    } else if (isNightWorking) {
        return text + ' ночная смена. Потом два выходных.';
    } else if (isFirstDayOff) {
        return text + ' первый выходной. Завтра ещё один.';
    } else {
        return text + ' второй выходной. Завтра в день на работу.';
    }
};

export function getContentData(date, considerTime = false) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const timeInSeconds = hours * 60 * 60 + minutes * 60 + seconds;
    const worker = 'Пескарь';
    const { isDayWorking, isNightWorking, isFirstDayOff } = getWorkingInfo(date);
    const text = `${considerTime ? 'Сегодня' : 'В этот день'} ${worker}`;

    if (isDayWorking) {
        if (considerTime && timeInSeconds > endtDayShift) {
            return text + ' завершил дневную смену в 20:00. Следующий день - ночная смена с 20:00';
        }
        return text + ' в дневной смене с 8:00 до 20:00. Следущий день - ночная смена с 20:00.';
    } else if (isNightWorking) {
        if (considerTime && timeInSeconds > startNightShift) {
            return text + ' в ночной смене с 20:00.';
        }
        return text + ' выходит в ночную смену с 20:00 до 8:00 следующего дня.';
    } else if (isFirstDayOff) {
        if (considerTime && timeInSeconds > endNightLength) {
            return text + ' закончил ночную смену в 8:00. Следующий день - выходной.';
        }
        return text + ' на ночной смене до 8:00. Следующий день - выходной.';
    } else {
        return text + ' отдыхает. Следующий день - дневная смена в 8:00.';
    }
}
