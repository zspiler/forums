import { GET_TOP_FORUMS, GET_FORUM, GET_OWNED_FORUMS } from '../actions/types';

const initialState = {
  topForums: [],
  searchForums: [],
  forum: null,
  loading: true,
  following: false,
  error: {},
  ownedForums: []
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
    case GET_OWNED_FORUMS:
      return {
        ...state,
        ownedForums: payload,
        loading: false
      };

    default:
      return state;
  }
}
