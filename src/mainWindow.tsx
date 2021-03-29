import { App } from './web/components/App';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { defaultState, reducer } from './web/redux/reducer'
import { initialize } from './web/initialize';
import { storeDebugMiddleware } from './web/redux/debug-middleware';
import { QuizClient } from './types';

const client = window['client'] as QuizClient;

console.log('starting react app');
const mount = document.querySelector('#react-mount');
const store = createStore(reducer, defaultState, applyMiddleware(storeDebugMiddleware));
initialize(store, client)
    .then(() => ReactDOM.render(<Provider store={ store }><App /></Provider>, mount));
