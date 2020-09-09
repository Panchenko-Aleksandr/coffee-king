import { CATCH_ERROR, CLOSE_MODAL_WINDOW, OPEN_MODAL_WINDOW, CHANGE_VISIBILITY_SIDEBAR } from './actionTypes';


export function catchError ( module, fn = '', msg ) {
  console.log ( `MODULE: ${ module } 
                FUNCTION: ${ fn } 
                MSG: ${ msg }` );
  return {
    type : CATCH_ERROR,
    module,
    fn,
    msg
  }
}

export function showModalInformation ( msg ) {
  return dispatch => {
    try {
      const options = {
        isShow : true,
        id : 'modalInformation',
        type : 'Information',
        title : 'Информация',
        text : msg
      };
      dispatch ( openModalWindow ( options ) );
    } catch ( e ) {
      dispatch ( catchError ( 'commonAction', 'showModalInformation', e ) );
    }
  }
}

export function showModalError ( msg ) {
  return dispatch => {
    try {
      const options = {
        isShow : true,
        id : 'modalShowError',
        type : 'Error',
        title : 'Ошибка',
        text : msg
      };
      dispatch ( openModalWindow ( options ) );
    } catch ( e ) {
      dispatch ( catchError ( 'commonAction', 'showModalError', e ) );
    }
  }
}

export function showModalConfirmation ( msg ) {
  return dispatch => {
    try {
      const options = {
        isShow : true,
        id : 'modalShowConfirmation',
        type : 'Confirmation',
        title : 'Подтверждение',
        text : msg
      };
      dispatch ( openModalWindow ( options ) );
    } catch ( e ) {
      dispatch ( catchError ( 'commonAction', 'showModalConfirmation', e ) );
    }
  }
}


export function openModalWindow ( options ) {
  return dispatch => {
    try {

      dispatch ( openModalWindowSuccess ( options ) )
    } catch ( e ) {
      dispatch ( catchError ( 'Layout', 'openModalWindow', e ) )
    }
  }
}

export function openModalWindowSuccess ( payload ) {
  return {
    type : OPEN_MODAL_WINDOW,
    payload
  }
}

export function closeModalWindow () {
  return {
    type : CLOSE_MODAL_WINDOW
  }
}

export function changeVisibilitySideBar(bool) {
  return {
    type : CHANGE_VISIBILITY_SIDEBAR,
    bool
  }
}
