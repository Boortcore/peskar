import { getUserPescarApp } from './pescar';
import { getUserZhorikApp } from './zhorik';

export const users = [
    {
        name: 'Пескарь',
        getApp: getUserPescarApp,
    },
    {
        name: '(для теста)',
        getApp: getUserZhorikApp,
    },
];
