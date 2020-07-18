import { createStore, combineReducers, applyMiddleware } from 'redux';
import authReducer from '../reducers/auth';
import logger from 'redux-logger'

const rootReducer = combineReducers(
    { auth: authReducer }
);

const configureStore = () => {
    return createStore(rootReducer, applyMiddleware(logger));
}

export default configureStore;
