import axios from 'axios';
import { GET_TOP_FORUMS, FORUM_ERROR, GET_FORUM } from '../actions/types';

// Get top 100 forums
export const getTopForums = () => async dispatch => {
  try {
    const res = await axios.get('/api/forums/top/100');
    dispatch({ type: GET_TOP_FORUMS, payload: res.data });
  } catch (err) {
    dispatch({
      type: FORUM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get forum
export const getForum = forumName => async dispatch => {
  try {
    const res = await axios.get('/api/forums/f/' + forumName);
    dispatch({ type: GET_FORUM, payload: res.data });
  } catch (err) {
    dispatch({
      type: FORUM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
