import { IS_SHOW_AUTH, FETCH_DATA_AUTH_USER, LOGOUT } from './actionTypes';
import axiosCustom from "../../config/axios";
import { catchError, showModalError, showModalInformation } from "./layoutAction";
import { fetchUserCart, initCartForTheNextShopSuccess } from "./cartAction";
import axios from "axios";
import { editorGoodURI } from "../../config/key";
import { updateGoodImage } from "./goodAction";

function axiosQuery ( query ) {
  // console.log ( query )
  return axiosCustom ( {
    data : { query }
  } );
}

export function changeShowAuth () {
  return {
    type : IS_SHOW_AUTH
  }
}

export function checkUserToken () {
  return async ( dispatch ) => {

    const token = localStorage.getItem ( "token" );

    if ( token ) {
      const query = `{
                    getUserByToken(token: "${ token }") {
                      _id
                      login
                      permission
                      sessionId
                      name
                      email
                      addressDelivery
                      isActivateAccount
                    }
                  }`;
      await axiosQuery ( query )
          .then ( res => {
            if ( res.data.data.getUserByToken?._id ) {
              dispatch ( authenticateUserSuccess ( res.data.data.getUserByToken ) );
              localStorage.setItem ( 'token', res.data.data.getUserByToken.sessionId );
              dispatch ( fetchUserCart ( res.data.data.getUserByToken._id ) )
            } else {
              dispatch ( showModalError ( 'Ошибка авторизации!' ) )
            }
          } )
          .catch ( e => {
            dispatch ( catchError ( 'goodAction', 'authenticateUser', e ) )
          } )
    }

  }
}

export function registerNewUser ( data ) {
  return async dispatch => {
    const query = `mutation {
                    addNewUser (login : "${ data.login }", 
                      password :"${ data.password }", 
                      permission :1, 
                      name:"${ data.name }", 
                      email:"${ data.email }", 
                      addressDelivery:"${ data.address }"
                    ) {
                      _id
                      login
                      sessionId
                    }
                  }`;
    await axiosQuery ( query )
        .then ( res => {
          if ( res.data.data.addNewUser._id ) {
            dispatch ( showModalInformation ( 'Пользователь успешно добавлен!' ) )
          } else {
            dispatch ( showModalError ( 'Добавление пользователя прошло с ошибками, повторите процедуру позже.' ) )
          }
        } )
        .catch ( e => {
          dispatch ( catchError ( 'authAction', 'registerNewUser', e ) )
        } )
  }
}

export function authenticateUser ( data ) {
  return async dispatch => {
    const query = `{
                    authUser (login :"${ data.login }", password:"${ data.password }"){
                      _id
                      login
                      permission
                      sessionId
                      name
                      email
                      addressDelivery
                      isActivateAccount
                  }}`;

    await axiosQuery ( query )
        .then ( res => {
          // console.log ( 'res', res );
          if ( res.data.data.authUser?._id ) {
            dispatch ( authenticateUserSuccess ( res.data.data.authUser ) );
            dispatch ( fetchUserCart ( res.data.data.authUser._id ) );
            localStorage.setItem ( 'token', res.data.data.authUser.sessionId );
          } else {
            dispatch ( showModalError ( 'Ошибка авторизации!' ) )
          }
        } )
        .catch ( e => {
          dispatch ( catchError ( 'goodAction', 'authenticateUser', e ) )
        } )
  }
}

export function authenticateUserSuccess ( payload ) {
  return {
    type : FETCH_DATA_AUTH_USER,
    payload
  }
}

export function logout () {
  return async dispatch => {
    const token = localStorage.getItem ( 'token' );
    localStorage.removeItem ( 'token' );
    const query = `{
                    logoutUser (token :"${ token }"){
                      _id
                  }}`;

    await axiosQuery ( query )
        .then ( res => {
          // console.log ( 'res', res );
          if ( res.data.data.logoutUser ) {
            dispatch ( logoutSuccess () );
            dispatch ( initCartForTheNextShopSuccess () );
            localStorage.removeItem ( 'token' );
          } else {
            dispatch ( showModalError ( 'Ошибка logout\'a!' ) )
          }
        } )
        .catch ( e => {
          dispatch ( catchError ( 'authAction', 'logout', e ) )
        } )
  }
}

export function logoutSuccess () {
  return {
    type : LOGOUT
  }
}




