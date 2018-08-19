import { createAction } from 'redux-actions';
const {
  TOAST,
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_MODAL,
  HIDE_MODAL,
  TOKEN_SET,
  OPERATION_FAIL,
  RESIZE_APP,
  SWITCH_LANGUAGE
} = require('../redux/actionTypes').default;
import * as request from '../utils/request';
import * as config from '../utils/config';

export function switchLanguage(language){
  return {
    type: SWITCH_LANGUAGE,
    data: language
  }
}

export function resize(appWidth,appHeight) {
  return {
    type: RESIZE_APP,
    data: {
      appWidth: appWidth,
      appHeight: appHeight
    }
  }
}


export const toast = createAction(TOAST, (text, timeout=2000, mid) => {
  if (!text) text = '网络异常，请稍后再试！';
  return {
    text,
    timeout,
    id: new Date().getTime(),
    mid: mid
  }
})

export function showLoading(maskParam = null, maskColor = null) {
  var maskTopPoz = null;
  if (typeof maskParam === 'string' && maskParam === 'MASK_ALL') {
    maskTopPoz = 0;
  } else if (typeof maskParam === 'string' && maskParam === 'MASK_BODY') {
    maskTopPoz = 44;
  } else if (typeof maskParam === 'number') {
    maskTopPoz = maskParam;
  } else {
    maskTopPoz = null;
  }
  return {
    type: SHOW_LOADING,
    maskTopPoz: maskTopPoz,
    maskColor: maskColor
  }
}

export function hideLoading() {
  return {
    type: HIDE_LOADING
  }
}

export function showModal(ui, uiProps) {
  return {
    type: SHOW_MODAL,
    data: {
      ui: ui,
      uiProps: uiProps
    }
  }
}
export function hideModal() {
  return {
    type: HIDE_MODAL
  }
}
export function tokenSet(token) {
  return {
    type: TOKEN_SET,
    data: token
  }
}

export function logout(tokenValue) {
  if(tokenValue===null)tokenValue='temp'
  return dispatch => {
    dispatch(showLoading())
    return  request.post('/api/logout', {token:tokenValue} ,{}).then(data => {
        // console.log(data);
        dispatch(hideLoading())
        return data;
      }).catch(error => {
        dispatch(hideLoading())
        return false;
      })
  }
}
