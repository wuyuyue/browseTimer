const {
    HOME_INIT_SUCCESS,
    HOME_INIT_FAIL
  } = require('../../redux/actionTypes').default;
const initialState = {
  index: {
    data: null,
    error: null
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case HOME_INIT_SUCCESS:
      return {
        ... state,
        index: {
          ... state.index,
          data: action.data
        }
      }
    case HOME_INIT_FAIL:
      return {
        ... state,
        index: {
          ... state.index,
          error: action.error
        }
      }


    default:
      return state
  }
}
