import { GET_TOP_FORUMS, GET_FORUM } from '../actions/types';

const initialState = {
  topForums: [],
  searchForums: [],
  forum: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_TOP_FORUMS:
      return {
        ...state,
        topForums: payload,
        loading: false
      };

    case GET_FORUM:
      return {
        ...state,
        forum: payload,
        loading: false
      };
    // case UPDATE_LIKES:
    //   return {
    //     ...state,
    //     posts: state.posts.map(post =>
    //       post._id === payload.postId ? { ...post, likes: payload.likes } : post
    //     ),
    //     loading: false
    //   };

    default:
      return state;
  }
}
