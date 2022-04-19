import { SET_ALERT, REMOVE_ALERT } from './types';
import * as uuid from 'uuid';

// passWord Alert
export const setAlert = (msg, alertType) => (dispatch) => {
  console.log('msg', msg);
  const id = uuid.v4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), 2000);
};
