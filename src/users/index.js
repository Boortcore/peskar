export const users = [
    {
        name: 'Пескарь',
        scheduleInfo: [
            { name: 'дневная смена', value: [new Date(2022, 6, 20, 8, 0, 0, 0), new Date(2022, 6, 20, 20, 0, 0, 0)] },
            { name: 'ночная смена', value: [new Date(2022, 6, 21, 20, 0, 0, 0), new Date(2022, 6, 22, 8, 0, 0, 0)] },
            { name: 'выходной', value: [new Date(2022, 6, 23, 20, 0, 0, 0), new Date(2022, 6, 23, 0, 0, 0, 0)], dayOff: true },
        ],
    },
    {
        name: '(для теста)',
        scheduleInfo: [
            { name: 'Первая смена', value: [new Date(2022, 4, 16, 8, 0, 0, 0), new Date(2022, 4, 17, 8, 0, 0, 0)] },
            { name: 'выходной', value: [new Date(2022, 4, 18, 0, 0, 0, 0), new Date(2022, 4, 18, 0, 0, 0, 0)], dayOff: true },
            { name: 'Вторая смена', value: [new Date(2022, 4, 19, 8, 0, 0, 0), new Date(2022, 4, 20, 8, 0, 0, 0)] },
            { name: 'Выходной', value: [new Date(2022, 4, 21, 0, 0, 0, 0), new Date(2022, 4, 22, 0, 0, 0, 0)], dayOff: true },
        ],
    },
];
