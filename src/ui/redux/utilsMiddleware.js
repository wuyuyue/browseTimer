import {toast} from '../layouts/appAction.js';
import { hashHistory } from 'react-router';
import { apiUnAuthMsg } from '../utils/config';

const {
  OPERATION_FAIL
} = require('./actionTypes').default;

export default function utilsMiddleware({ dispatch }) {
  return next => action => {
    const { type } = action;
    if (!type) {
      return next(action);
    }
    if (type.indexOf('FAIL') > -1) {
      if (typeof action.error === 'object') {
        if (action.error.message === apiUnAuthMsg) {
          window.location.href='/login'
        } else {
          dispatch(toast(action.error.message, 2000));
        }
      }
    }

    next(action);
  }
}
