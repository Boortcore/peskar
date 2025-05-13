import './styles.css';
import { getProductionCalendarInfo } from './get-production-calendar-info';
import { HOLLYDAY_SHIFT, WEEKEND_SHIFT, NON_WORKING_DAY, DAYOFF, WARNING_MESSAGE, COLORS_KEY_LOCALSTORAGE, SELECTED_USER_KEY_LOCAL_STORAGE } from './constants';
import { UserSelector } from './user-selector';
import { users } from './users';
import { App } from './app/app';

const COLOR = {
    0: '#0CCA4A',
    1: '#ffff00',
    2: '#FFA500',
    3: '#b7be0b',
    4: '#756ad6',
    5: '#18b739',
    6: '#376d9b',
    7: '#2ba8bc',
    8: '#ecd84a',
    9: '#19a9fc',
    [WEEKEND_SHIFT]: '#5C0029',
    [HOLLYDAY_SHIFT]: '#2708A0',
    [NON_WORKING_DAY]: '#ff0000', //'#FB4D3D',
    [DAYOFF]: '#ffffff', //'#FB4D3D',
};

const appContainerElement = document.querySelector('.app-container');
const selectUserContainer = document.querySelector('.user-selector-container');

const localStorageData = localStorage.getItem(COLORS_KEY_LOCALSTORAGE);
const selectedUserFromLocalStorage = localStorage.getItem(SELECTED_USER_KEY_LOCAL_STORAGE) || 0;
const colors = localStorageData ? { ...COLOR, ...JSON.parse(localStorageData) } : COLOR;

const saveHandlers = {
    saveColors(colors) {
        localStorage.setItem(COLORS_KEY_LOCALSTORAGE, JSON.stringify(colors));
    },
};

function initApp(index, prodCalendarInfo, message) {
    const { scheduleInfo } = users[index];
    const app = new App(scheduleInfo, colors, saveHandlers, prodCalendarInfo, message);
    app.init(appContainerElement);
    return app;
}

function startApp(prodCalendarInfo, message) {
    const start = (index) => initApp(index, prodCalendarInfo, message);

    const userSelector = new UserSelector(users);
    userSelector.setValue(selectedUserFromLocalStorage);
    
    let app = start(selectedUserFromLocalStorage);

    userSelector.setChangeListener((index) => {
        app.destroy();
        app = start(index);
        localStorage.setItem(SELECTED_USER_KEY_LOCAL_STORAGE, index);
    });
    userSelector.init(selectUserContainer);
}

getProductionCalendarInfo(new Date())
    .then((prodCalendarInfo) => {
        startApp(prodCalendarInfo);
    })
    .catch(() => {
        startApp(null, WARNING_MESSAGE);
    });
