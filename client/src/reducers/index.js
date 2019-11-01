import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import post from './post';
import forum from './forum';

export default combineReducers({
  alert,
  auth,
  post,
  forum
});
