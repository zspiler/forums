import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  GET_FORUM_POSTS,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
  UPDATE_COMMENT
} from './types';

// Get posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get('/api/posts/recent/30');
    dispatch({ type: GET_POSTS, payload: res.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get forum's posts
export const getForumPosts = forumName => async dispatch => {
  try {
    const res = await axios.get('/api/posts/forum/' + forumName);
    dispatch({ type: GET_FORUM_POSTS, payload: res.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get single post
export const getPost = postId => async dispatch => {
  try {
    const res = await axios.get('/api/posts/' + postId);
    dispatch({ type: GET_POST, payload: res.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Like a post
export const likePost = postId => async dispatch => {
  try {
    const res = await axios.put('/api/posts/like/' + postId);
    dispatch({ type: UPDATE_LIKES, payload: { postId, likes: res.data } });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Unlike a post
export const unlikePost = postId => async dispatch => {
  try {
    const res = await axios.put('/api/posts/unlike/' + postId);
    dispatch({ type: UPDATE_LIKES, payload: { postId, likes: res.data } });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add comment
export const addComment = (postId, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.post(
      '/api/posts/comment/' + postId,
      formData,
      config
    );
    dispatch({ type: ADD_COMMENT, payload: res.data });
    dispatch(setAlert('Comment Added', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Remove comment
export const removeComment = (postId, commentId) => async dispatch => {
  try {
    await axios.delete('/api/posts/comment/' + postId + '/' + commentId);
    dispatch({ type: REMOVE_COMMENT, payload: commentId });
    dispatch(setAlert('Comment Removed', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Like a comment
export const likeComment = (postId, commentId) => async dispatch => {
  try {
    const res = await axios.put('/api/posts/like/' + postId + '/' + commentId);
    dispatch({
      type: UPDATE_COMMENT,
      payload: { postId, commentId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Unlike a comment
export const unlikeComment = (postId, commentId) => async dispatch => {
  try {
    const res = await axios.put(
      '/api/posts/unlike/' + postId + '/' + commentId
    );
    dispatch({
      type: UPDATE_COMMENT,
      payload: { postId, commentId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
