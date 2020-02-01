import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types';
import { setAlert } from './alert'; //dont need CONNECT because we arent using state ;)
import setAuthToken from '../utils/setAuthToken';

// Register user

export const register = ({ username, email, password }) => async dispatch => {
  const config = {
    headers: { 'Content-Type': 'application/json' }
  };

  const body = JSON.stringify({ username, email, password });

  try {
    const res = await axios.post('/api/users', body, config);
    // if registration is successful on server
    //send token
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data //TOKEN
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Load user

export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token); //puts token in Default header
  }

  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Login user

export const login = (email, password) => async dispatch => {
  const config = {
    headers: { 'Content-Type': 'application/json' }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);
    // if login is successful on server
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data //TOKEN
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response;
    if (errors) {
      dispatch(setAlert('Invalid Credentials', 'danger'));
      dispatch({
        type: LOGIN_FAIL
      });
    }
  }
};

// Logout

export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
};
