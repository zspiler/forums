// // Follow forum
// export const followForum = forumId => async dispatch => {
//     //PUT  http://localhost:5000/api/users/unfollow/5dbbfe6205a1dd6bfc3e7c96
//     try {
//       const res = await axios.put('/api/users/follow/'+forumId);
//       dispatch({ type: GET_FORUM, payload: res.data });
//     } catch (err) {
//       dispatch({
//         type: FORUM_ERROR,
//         payload: { msg: err.response.statusText, status: err.response.status }
//       });
//     }
//   };
