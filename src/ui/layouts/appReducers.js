const {
  TOAST,
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_MODAL,
  HIDE_MODAL,
  TOKEN_SET,
  RESIZE_APP,
  SWITCH_LANGUAGE
} = require('../redux/actionTypes').default;

const initialState = {
  toast: {
    text: null,
    timeout: 2000,
    id: null,
    mid: false
  },
  showLoading: false,
  maskTopPoz: null,
  maskColor: null,
  modal: {
    ui: null,
    uiProps: null
  },
  drawerOpen: false,
  token: undefined,
  appWidth: 0,
  appHeight: 0,
  appLanguage: navigator.language || 'en'

};


export default function (state = initialState, action) {
  const { payload } = action;
  switch (action.type) {
    case TOAST:
      return {
        ...state,
        toast: {
          ...state.toast,
          ...payload
        }
      };
    case SHOW_LOADING:
      return {
        ...state,
        showLoading: true,
        maskTopPoz: action.maskTopPoz,
        maskColor: action.maskColor
      };
    case HIDE_LOADING:
      return {
        ...state,
        showLoading: false,
        maskTopPoz: null,
        maskColor: null
      };
    case SHOW_MODAL:
      return {
        ...state,
        modal: {
          ui: action.data.ui,
          uiProps: action.data.uiProps
        }
      };
    case HIDE_MODAL:
      return {
        ...state,
        modal: {
          ui: null,
          uiProps: null
        }
      };
    case TOKEN_SET:
      return {
        ...state,
        token: action.data
      }
    case RESIZE_APP:
      return {
        ...state,
        appWidth: action.data.appWidth,
        appHeight: action.data.appHeight
      }
    case SWITCH_LANGUAGE:
      return {
        ...state,
        appLanguage: action.data,
      }

    default :
      return state;
  }
}
