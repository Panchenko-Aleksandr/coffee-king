import { FETCH_ALL_USERS, SET_SEARCH_STR } from './actionTypes';

import { catchError, showModalInformation } from "./layoutAction";
import axiosCustom from "../../config/axios";

function axiosQuery ( query ) {
  console.log ( query );
  return axiosCustom ( {
    data : { query }
  } );
}

export function fetchAllUsers () {
  return async ( dispatch, getState ) => {

    const { login, name, email } = getState ().userReducer.search;

    let queryStr = '';

    if ( login && login !== '' ) {
      queryStr += `login : "${ login }",`
    }

    if ( name && name !== '' ) {
      queryStr += `name : "${ name }",`
    }

    if ( email && email !== '' ) {
      queryStr += `email : "${ email }",`
    }

    if ( queryStr !== '' ) {
      queryStr = `(${ queryStr.slice ( 0, -1 ) })`
    }

    const query = `{
                  getAllUsers${ queryStr }  {
                    _id
                    login
                    permission
                    name
                    email
                    addressDelivery
                    isActivateAccount
                    cart {
                      _id
                      itemsGood {
                        good {
                          _id
                          name
                          img
                          price
                        }
                        qty
                        price
                      }
                      orderDate
                      orderStatus
                    }
                  }
                }`;

    await axiosQuery ( query )
        .then ( res => {
              console.log ( 'res', res.data.data.getAllUsers );
              dispatch ( fetchAllUsersSuccess ( res.data.data.getAllUsers ) )
            }
        )
        .catch ( e => {
          dispatch ( catchError ( 'cartAction', 'delItemFromCart', e ) )
        } )
  }
}

export function fetchAllUsersSuccess ( payload ) {
  return {
    type : FETCH_ALL_USERS,
    payload
  }
}

export function setSearchStr ( param, str ) {
  switch ( param ) {
    case 'login' : {
      return {
        type : SET_SEARCH_STR,
        payload : { login : str }
      }
    }
    case 'name' : {
      return {
        type : SET_SEARCH_STR,
        payload : { name : str }
      }
    }
    case 'email' : {
      return {
        type : SET_SEARCH_STR,
        payload : { email : str }
      }
    }
  }
}
