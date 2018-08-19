const {
  HOME_INIT_SUCCESS,
  HOME_INIT_FAIL
} = require('../../redux/actionTypes').default;
import { showLoading, hideLoading } from '../appAction';
import * as request from '../../utils/request';
import * as config from '../../utils/config';

export function index(token) {
  return dispatch => {
    dispatch(showLoading())
    return request.furtherPost("http://sd-api.papakq.com/home/index", {token: token}).then(data => {
      // console.log(data,'werewrwerwe');
      dispatch(hideLoading())
      dispatch({
        type: HOME_INIT_SUCCESS,
        data: data
      });
      return data;
    }).catch(error => {
      dispatch(hideLoading())
      dispatch({
        type: HOME_INIT_FAIL,
        error: error
      });
      return false;
    })
  }
}
