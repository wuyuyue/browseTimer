import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import createLogger from 'redux-logger';
import reducers from './reducers';
import utilsMiddleware from './utilsMiddleware';
import { composeWithDevTools } from 'redux-devtools-extension';

const logger = createLogger();

var middlewares = [
  thunkMiddleware,
  promiseMiddleware,
  utilsMiddleware
];

let composeEnhancers = applyMiddleware(...middlewares);
if (process.env && process.env.NODE_ENV !== undefined && process.env.NODE_ENV !== 'production') {
  middlewares.push(logger);
  composeEnhancers = composeWithDevTools(applyMiddleware(...middlewares));
}

export default function configureStore(initialState) {
  return composeEnhancers(createStore)(reducers, initialState);
}
