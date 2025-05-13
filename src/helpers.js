export const createElement = (template) => {
    const container = document.createElement('template');
    container.innerHTML = template;
    return container.content.firstElementChild;
};

export function declOfNum(number, titles) { // Функция для склонения слов
    // number - число, для которого нужно склонить слово
    // titles - массив из 3-х слов, например ['день', 'дня', 'дней']
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
}
