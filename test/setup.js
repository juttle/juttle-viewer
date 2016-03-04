import { jsdom } from 'jsdom';

global.document = jsdom('<!doctype html><html><body><div id="brace-editor"></div></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;
let localStorageObject = {};
let localStorage = {
    setItem: function(key, value) {localStorageObject[key] = value;},
    getItem: function(key) { return localStorageObject[key]; }
};

global.localStorage = localStorage;
