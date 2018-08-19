import { combineReducers } from 'redux'
import app from '../layouts/appReducers'
import home from '../layouts/home/reducer'

const reducers = combineReducers({
  app,
  home,
})

export default reducers
