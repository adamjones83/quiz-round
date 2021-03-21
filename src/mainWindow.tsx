import { App } from './components/App';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { defaultState, reducer } from './redux/reducer';
import { initialize } from './redux/initialize';
import { storeDebugMiddleware } from './redux/debug-middleware';

/* ENABLE EXPOSED NODE FUNCTIONALITY VIA PRELOAD FUNCTIONS AND/OR IPC CALLS
import { ExposedFunctions } from './preload';
import { ipcRenderer } from 'electron';
*/ 
console.warn('using a non-minified react for development, swap with minified for production');
console.log('starting react app');
const mount = document.querySelector('#react-mount');
const store = createStore(reducer, defaultState, applyMiddleware(storeDebugMiddleware));
initialize(store)
    .then(() => ReactDOM.render(<Provider store={ store }><App /></Provider>, mount));
