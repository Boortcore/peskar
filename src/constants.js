export const PERIOD_ID = {
    WORKING_DAY_ENDED: 0,
    WORKING_DAY: 1,
    WORKING_NIGHT_PART_1: 2,
    BEFORE_WORKING_NIGHT: 3,
    WORKING_NIGHT_ENDED: 4,
    WORKING_NIGHT_PART_2: 5,
    DAY_OFF: 6,
    BEFORE_WORKING_DAY: 7,
};

export const MESSAGES_MAP = {
    [PERIOD_ID.WORKING_DAY_ENDED]: 'завершил дневную смену в 20:00. Следующий день - ночная смена с 20:00.',
    [PERIOD_ID.WORKING_DAY]: 'в дневной смене с 8:00 до 20:00. Следущий день - ночная смена с 20:00.',
    [PERIOD_ID.WORKING_NIGHT_PART_1]: 'в ночной смене с 20:00 до 8:00 следующего дня.',
    [PERIOD_ID.BEFORE_WORKING_NIGHT]: 'выходит в ночную смену с 20:00 до 8:00 следующего дня.',
    [PERIOD_ID.WORKING_NIGHT_ENDED]: 'завершил ночную смену в 8:00. Следующий день - выходной.',
    [PERIOD_ID.WORKING_NIGHT_PART_2]: 'в ночной смене до 8:00. Следующий день - выходной.',
    [PERIOD_ID.DAY_OFF]: 'отдыхает. Следующий день - дневная смена в 8:00.',
    [PERIOD_ID.BEFORE_WORKING_DAY]: 'выходит в дневную смену с 08:00 до 20:00. Следующий день - ночная смена с 20:00',
};
