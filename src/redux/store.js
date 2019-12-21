/*
The Redux store that holds the state of the application
*/

import {createStore} from 'redux';
import commentReducers from './reducers/commentReducers';
import {combineReducers} from 'redux';

const initState = {};

const store = createStore(
    combineReducers({
        comments: commentReducers,
    }),
    initState,
);

export default store;