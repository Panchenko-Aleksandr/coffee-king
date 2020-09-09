import {
  FETCH_ALL_USERS,
  SET_SEARCH_STR
} from '../actions/actionTypes'

const initialState = {
  users : [],
  search : {
    login : undefined,
    name : undefined,
    email : undefined
  }
};

export default function userReducer ( state = initialState, action ) {
  switch ( action.type ) {
    case SET_SEARCH_STR : {
      return {
        ...state,
        search : {
          ...state.search,
          ...action.payload
        }
      }
    }
    case FETCH_ALL_USERS : {
      return {
        ...state,
        users : action.payload
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}
