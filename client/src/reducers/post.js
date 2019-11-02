import {
  GET_POSTS,
  UPDATE_LIKES,
  GET_FORUM_POSTS,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
  POST_ERROR,
  UPDATE_COMMENT
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
    case GET_FORUM_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false
      };

    // case ADD_POST:
    //   return {
    //     ...state,
    //     posts: [payload, ...state.posts],
    //     loading: false
    //   };

    // case DELETE_POST:
    //   return {
    //     ...state,
    //     posts: state.posts.filter(post => post._id !== payload),
    //     loading: false
    //   };

    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };

    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.postId ? { ...post, likes: payload.likes } : post
        ),
        post: { ...state.post, likes: payload.likes },
        loading: false
      };
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            comment => comment._id !== payload
          )
        },
        loading: false
      };
    case UPDATE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.map(comment =>
            comment._id === payload.commentId
              ? { ...comment, likes: payload.likes }
              : comment
          )
        },
        loading: false
      };
    default:
      return state;
  }
}
