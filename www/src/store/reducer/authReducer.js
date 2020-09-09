import { IS_SHOW_AUTH, FETCH_DATA_AUTH_USER, LOGOUT } from '../actions/actionTypes';

const initialState = {
  isAuth : undefined,
  isAdmin : undefined,
  showAuthForm : false,
  error : '',
  user : {}
};

export default function authReducer ( state = initialState, action ) {
  switch ( action.type ) {
    case LOGOUT : {
      return {
        ...state,
        user : {},
        isAuth : undefined,

      }
    }

    case FETCH_DATA_AUTH_USER : {
      return {
        ...state,
        user : action.payload,
        isAuth : true,
        showAuthForm : false
      }

    }
    case IS_SHOW_AUTH : {
      return {
        ...state,
        showAuthForm : !state.showAuthForm
      }
    }
    default : {
      return { ...state }
    }
  }
}
