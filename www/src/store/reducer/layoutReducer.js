import { CATCH_ERROR, CLOSE_MODAL_WINDOW, OPEN_MODAL_WINDOW, CHANGE_VISIBILITY_SIDEBAR } from '../actions/actionTypes';

const initialState = {
  Modal : {
    isShow : false,
    id : '',
    type : '',
    title : '',
    text : '',
    fnAgree : null,

    module : '',
    fn : null,
    msg : ''
  },
  SideBar : {
    isShow : false
  }
};


export default function layoutReducer ( state = initialState, action ) {
  switch ( action.type ) {
    case CHANGE_VISIBILITY_SIDEBAR: {
      return {
        ...state,
        SideBar : {
          ...state.SideBar,
          isShow : action.bool || !state.SideBar.isShow
        }
      }
    }

    case CATCH_ERROR:

      return {
        ...state,
        Modal : {
          isShow : true,
          id : 'modalShowError',
          type : 'Error',
          text : `В модуле "${ action.module }" во время выполнения "${ action.fn }" произошла ошибка: ${ action.msg }`,
          title : 'Ошибка'
        }
      };

    case OPEN_MODAL_WINDOW:
      return {
        ...state,
        Modal : {
          ...state.Modal,
          isShow : true,
          id : action.payload.id,
          type : action.payload.type,
          title : action.payload.title,
          text : action.payload.text,
          fnParam : action.payload.fnParam,
          fnAgree : action.payload.fnAgree
        }
      };

    case CLOSE_MODAL_WINDOW:
      return {
        ...state,
        Modal : { isShow : false }
      };

    default:
      return { ...state };

  }
}
