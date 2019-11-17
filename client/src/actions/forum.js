import axios from 'axios';
import { setAlert } from './alert';

import {
  GET_TOP_FORUMS,
  FORUM_ERROR,
  GET_FORUM,
  CREATE_FORUM,
  DELETE_FORUM,
  GET_OWNED_FORUMS
} from '../actions/types';

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

// Get forums that user owns
export const getOwnedForums = userId => async dispatch => {
  try {
    const res = await axios.get('/api/forums/owned/' + userId);
    dispatch({ type: GET_OWNED_FORUMS, payload: res.data });
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

export const createForum = (formData, history) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.post('/api/forums', formData, config); //added config
    dispatch({ type: CREATE_FORUM, payload: res.data });
    dispatch(setAlert('Forum Created', 'success'));
    history.push('/f/' + formData.name);
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: FORUM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete forum
export const deleteForum = (forumId, history) => async dispatch => {
  if (window.confirm('Are you sure you want to delete this forum?')) {
    try {
      await axios.delete('/api/forums/' + forumId);
      dispatch({ type: DELETE_FORUM, payload: forumId });
      dispatch(setAlert('Forum Deleted', 'success'));
      history.push('/');
    } catch (err) {
      console.log(err);
      dispatch({
        type: FORUM_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};
