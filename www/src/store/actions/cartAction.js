import { FETCH_USER_CART, ADD_ITEM_TO_CART, DEL_ITEM_FROM_CART, CREATE_ORDER, FETCH_LAST_NOT_COMPLETE_CART, FETCH_CART_BY_ID } from '../actions/actionTypes';

import axiosCustom from "../../config/axios";
import { catchError, showModalError, showModalInformation } from "./layoutAction";
import { checkUserToken } from "./authAction";
import { INIT_CART_FOR_THE_NEXT_SHOP } from "./actionTypes";

function axiosQuery ( query ) {
  // console.log ( query );
  return axiosCustom ( {
    data : { query }
  } );
}

export function addItemToCart ( item, options ) {
  return async ( dispatch ) => {
    const { needMessage } = options;
    const userToken = localStorage.getItem ( "token" );
    // console.log ( userToken, item );
    const query = `mutation {
                          addNewGoodInCart(userToken: "${ userToken }", goodId: "${ item }") {
                            _id
                            login
                          }
                        }`;
    // console.log ( query );

    await axiosQuery ( query )
        .then ( res => {
              dispatch ( checkUserToken () );

              if ( needMessage ) {
                dispatch ( showModalInformation ( 'Товар добавлен в корзину' ) )
              }

            }
        )
        .catch ( e => {
          dispatch ( catchError ( 'cartAction', 'addItemToCart', e ) )
        } )
  }
}

export function subItemFromCart ( item ) {
  return async ( dispatch ) => {
    const userToken = localStorage.getItem ( "token" );
    const query = `mutation {
                              subItemFromGood(userToken: "${ userToken }", goodId: "${ item }") {
                                _id
                                login
                                cart {
                                  _id
                                  itemsGood {
                                    _id
                                    qty
                                    price
                                    good {
                                      _id
                                      name
                                      price
                                    }
                                  }
                                }
                              }
                            }`;

    await axiosQuery ( query )
        .then ( res => {
              console.log ( 'res', res.data.data.subItemFromGood );
              dispatch ( checkUserToken () );
            }
        )
        .catch ( e => {
          dispatch ( catchError ( 'cartAction', 'subItemFromCart', e ) )
        } )
  }
}

export function delItemFromCart ( item ) {
  return async ( dispatch ) => {
    const { id, needMessage } = item;
    const userToken = localStorage.getItem ( "token" );
    const query = `mutation {
                              delItemFromCart(userToken: "${ userToken }", goodId: "${ id }") {
                                _id
                                login
                                cart {
                                  _id
                                  itemsGood {
                                    _id
                                    qty
                                    price
                                    good {
                                      _id
                                      name
                                      price
                                    }
                                  }
                                }
                              }
                            }`;

    await axiosQuery ( query )
        .then ( res => {
              // console.log ( 'res', res.data.data.delItemFromCart );
              dispatch ( checkUserToken () );

              if ( needMessage ) {
                dispatch ( showModalInformation ( 'Товар удален из корзины корзину' ) )
              }
            }
        )
        .catch ( e => {
          dispatch ( catchError ( 'cartAction', 'delItemFromCart', e ) )
        } )
  }
}

export function fetchUserCart ( userId ) {
  return async ( dispatch, getState ) => {
    let userSrt = '';

    if ( userId ) {
      userSrt = userId;
    } else {
      userSrt = await getState ().authReducer.user._id;
    }


    const query = `{
                    getCartUser (userId : "${ userSrt }") {
                      _id
                      login
                      cart {
                        _id
                        orderDate
                        orderStatus
                        itemsGood {
                          good {
                             _id
                            name
                            img
                             tag
                          }
                          qty
                          price
                        }
                      }
                    }
                  }`;
    await axiosQuery ( query )
        .then ( res => {
          const allCart = res.data.data.getCartUser;
          if ( allCart.length > 0 ) {
            dispatch ( fetchUserCartSuccess ( allCart ) );

            const cart = allCart[ 0 ].cart.filter ( c => c.orderStatus === 0 )[ 0 ];
            if ( cart ) {
              dispatch ( fetchLastNotCompleteCart ( cart ) );
            }
          } else {
            dispatch ( showModalError ( 'Ошибка авторизации!' ) )
          }
        } )
        .catch ( e => {
          dispatch ( catchError ( 'cartAction', 'fetchUserCart', e ) )
        } )
  }
}

export function fetchUserCartSuccess ( payload ) {
  return {
    type : FETCH_USER_CART,
    payload
  }

}

export function fetchLastNotCompleteCart ( payload ) {
  return {
    type : FETCH_LAST_NOT_COMPLETE_CART,
    payload
  }
}

//CHECKOUT
export function filterCartById ( id ) {
  return async ( dispatch ) => {
    try {
      const query = `{
                      getCartById(cartId: "${ id }") {
                        _id
                        itemsGood {
                          _id
                          good {
                            _id
                            name
                            img
                            price
                            oldPrice
                          }
                          qty
                          price
                        }
                        orderDate
                        orderStatus
                      }
                    }`;

      await axiosQuery ( query )
          .then ( res => {
            const cart = res.data.data.getCartById;
            if ( cart ) {
              dispatch ( filterCartByIdSuccess ( cart ) );
            } else {
              dispatch ( showModalError ( 'Произошла ошибка при получении корзины' ) )
            }
          } )
          .catch ( e => {
            dispatch ( catchError ( 'cartAction', 'fetchUserCart', e ) )
          } )
    } catch ( e ) {
      dispatch ( catchError ( 'cartAction', 'filterCartById', e ) )
    }
  }
}

export function filterCartByIdSuccess ( payload ) {
  return {
    type : FETCH_CART_BY_ID,
    payload
  }
}

export function changeOrderStatus ( cartId, status ) {
  return async dispatch => {

    const query = `mutation{
                            changeStatusUserCart(cartId :"${ cartId }", status : ${ status }){
                              _id
                              itemsGood {
                                _id
                                good{
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
                          }`;
    await axiosQuery ( query )
        .then ( res => {
          const cart = res.data.data.changeStatusUserCart;
          console.log ( 'cart', cart );
          if ( cart ) {
            if ( status === 1 ) {
              dispatch ( initCartForTheNextShopSuccess () );
              dispatch ( showModalInformation ( 'You have successfully placed new order. We will contact you as soon as we can.' ) )
            }
            dispatch ( filterCartByIdSuccess ( cart ) );

            if (status === 2) {
              dispatch ( showModalInformation ( 'You have successfully sending order to the buyer.' ) )
            }

          } else {
            dispatch ( showModalError ( 'Произошла ошибка при получении корзины' ) )
          }
        } )
        .catch ( e => {
          dispatch ( catchError ( 'cartAction', 'fetchUserCart', e ) )
        } )
  }
}

export function initCartForTheNextShopSuccess () {
  return {
    type : INIT_CART_FOR_THE_NEXT_SHOP
  }
}
