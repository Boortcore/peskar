import { App } from '../app/app';
export function getUserZhorikApp(colors, saveHandlers, prodCalendarInfo, message) {
    const scheduleInfo = [
        { name: 'дневная', value: [new Date(2022, 6, 20, 8, 0, 0, 0), new Date(2022, 6, 20, 20, 0, 0, 0)] },
        { name: 'выходной', value: [new Date(2022, 6, 21, 20, 0, 0, 0), new Date(2022, 6, 22, 0, 0, 0, 0)], dayOff: true },
    ];

    const app = new App(scheduleInfo, colors, saveHandlers, prodCalendarInfo, message);

    return app;
}
