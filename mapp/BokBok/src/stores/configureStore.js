import { createStore, combineReducers, applyMiddleware } from 'redux';
import authReducer from '../reducers/auth';
import chatReducer from '../reducers/chat';
import logger from 'redux-logger'

const rootReducer = combineReducers(
    { auth: authReducer, chat: chatReducer }
);

const configureStore = () => {
    return createStore(rootReducer, applyMiddleware(logger));
}

export default configureStore;
