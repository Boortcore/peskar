import './styles.css';
import { getProductionCalendarInfo } from './get-production-calendar-info';
import { App } from './app';
const scheduleInfo = [
    { name: 'дневная', value: [new Date(2022, 6, 20, 8, 0, 0, 0), new Date(2022, 6, 20, 20, 0, 0, 0)] },
    { name: 'ночная', value: [new Date(2022, 6, 21, 20, 0, 0, 0), new Date(2022, 6, 22, 8, 0, 0, 0)] },
    { name: 'выходной', value: [new Date(2022, 6, 23, 0, 0, 0, 0), new Date(2022, 6, 23, 0, 0, 0, 0)], dayOff: true },
];

const COLOR = {
    SHIFT: '#0CCA4A',
    SHIFT_PART: 'yellow',
    LAST_SHIFT_PART: 'orange',
    DAYOFF: 'white',
    HOLLYDAY_SHIFT: '#5C0029',
    WEEKEND_SHIFT: '#2708A0',
    WEEKEND: 'red', //'#FB4D3D',
};
const appContainerElement = document.querySelector('#container');
getProductionCalendarInfo(new Date())
    .then((prodCalendarInfo) => {
        const app = new App(scheduleInfo, COLOR, prodCalendarInfo);
        app.init(appContainerElement);
    })
    .catch(() => {
        const warningMessage = `Внимание! Данные производственного календаря не загрузились! Отображения праздничных дней на календаре не будет!
        Некоторые рабочие субботы и воскресенья будут учитываться как нерабочие. Некоторые праздничные будние дни будут считаться рабочими днями.`;
        const app = new App(scheduleInfo, COLOR, undefined, warningMessage);
        app.init(appContainerElement);
    });
