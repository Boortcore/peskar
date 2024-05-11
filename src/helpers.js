export const getDayNumberSinceStartYear = (date) => {
    const year = date.getFullYear();
    const startedTime = +new Date(2022, 0, 1);
    const diff = +date - startedTime;
    return Math.floor(diff / 1000 / 60 / 60 / 24);
};

export const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
};

export const formatDate = (date) => {
    return [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join('-');
};

export const createElement = (template) => {
    const container = document.createElement('template');
    container.innerHTML = template;
    return container.content.firstElementChild;
};
