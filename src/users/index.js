export const users = [
    {
        name: 'Пескарь',
        scheduleInfo: [
            { name: 'дневная', value: [new Date(2022, 6, 20, 8, 0, 0, 0), new Date(2022, 6, 20, 20, 0, 0, 0)] },
            { name: 'ночная', value: [new Date(2022, 6, 21, 20, 0, 0, 0), new Date(2022, 6, 22, 8, 0, 0, 0)] },
            { name: 'выходной', value: [new Date(2022, 6, 23, 20, 0, 0, 0), new Date(2022, 6, 23, 0, 0, 0, 0)], dayOff: true },
        ],
    },
    {
        name: '(для теста)',
        scheduleInfo: [
            { name: 'дневная', value: [new Date(2022, 6, 20, 8, 0, 0, 0), new Date(2022, 6, 20, 20, 0, 0, 0)] },
            { name: 'выходной', value: [new Date(2022, 6, 21, 20, 0, 0, 0), new Date(2022, 6, 22, 0, 0, 0, 0)], dayOff: true },
        ],
    },
];
