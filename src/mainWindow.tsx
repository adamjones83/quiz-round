import { App } from './components/App';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { defaultState, reducer } from './redux/reducer';
import { initialize } from './redux/initialize';

/* ENABLE EXPOSED NODE FUNCTIONALITY VIA PRELOAD FUNCTIONS AND/OR IPC CALLS
import { ExposedFunctions } from './preload';
import { ipcRenderer } from 'electron';
*/ 
console.log('starting react app');
const mount = document.querySelector('#react-mount');
const store = createStore(reducer, defaultState);
initialize(store)
    .then(() => ReactDOM.render(<Provider store={ store }><App /></Provider>, mount));
