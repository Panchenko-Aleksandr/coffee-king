import React, { Component } from 'react'
import { connect } from 'react-redux';
import moment from 'moment';
import './Cart.scss';
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import CartLine from "./CartLine";
import { NavLink } from "react-router-dom";
import Loader from "../Loader/Loader";
import { filterCurrency, pageToUpToTop } from "../../utils";
import { delItemFromCart, fetchUserCart } from "../../store/actions/cartAction";
import { openModalWindow } from "../../store/actions/layoutAction";
import { filter } from "async";
import CartListOfUser from "./CartListOfUser";

class Cart extends Component {

  componentDidMount () {
    pageToUpToTop ();
    if ( this.props.match?.params?.userId ) {
      console.log ( 'refresh' )
      console.log ( 'this.props.match.params.userId', this.props.match.params.userId )
      this.props.fetchUserCart ( this.props.match.params.userId );
    }

  }

  handleDeleteItems = ( e ) => {
    const block = e.target.closest ( 'figure' );
    const params = {
      id : block.dataset.id,
      options : { needMessage : true }
    };

    const options = {
      id : 'modalQuestBeforeDeleteOrder',
      type : 'Confirmation',
      title : "Подтверждение",
      text : `Вы действительно хотите удалить товар "${ block.dataset.name }" ?`,
      fnParam : params,
      fnAgree : this.props.delItemFromCart,
    };
    this.props.openModalWindow ( options );
  };

  renderMiniCart = ( data ) => {
    let total = 0;
    if ( !data ) {
      return <p>No products in the cart.</p>
    } else {
      return (
          <>

            {
              data.itemsGood.map ( ( i, idx ) => {
                total += ( i.qty * i.price );
                return (
                    <div className="cart-wrapper-mini" key={ i._id }>
                      <figure data-id={ i.good._id } data-name={ i.good.name } onClick={ this.handleDeleteItems }>
                        <img src={ `/img/items/${ i.good.img }-preview.webp` } alt="Delete this item from cart"/>
                        <span className="item-cross">❌</span>
                      </figure>

                      <div className="cart-item">
                        <div className="item-wrapper">
                          <div className="item-name">
                            <NavLink to={ `/shop/${ i.good._id }` }><span>{ i.good.name }</span></NavLink>
                          </div>
                          <div className="item-price-wrapper">
                            <span className="item-qty">{ i.qty } ×</span>
                            <span className="item-price">{ filterCurrency ( i.price ) }</span>
                          </div>
                        </div>
                      </div>
                    </div>
                )
              } )
            }


            <div className="item-subtotal">
              <span className="total">SubTotal: { filterCurrency ( total.toFixed ( 2 ) ) }</span>
            </div>
            <div className="item-buttons">
              <NavLink to={ '/cart' } className="btn btn-view-cart">View Cart</NavLink>
              <NavLink to={ `/checkout/${ data._id }` } className="btn btn-checkout"><span className="btn btn-checkout">CHECKOUT</span></NavLink>
            </div>
          </>
      )
    }
  };


  getSumOrder = ( items ) => {
    return items.reduce ( ( acc, item ) => {
      return acc += item.qty * item.price;
    }, 0 );
  };

  checkStatusOrder = ( status ) => {
    switch ( status ) {
      case 0: {
        return <span className="order-status-register">In the process of registration</span>
      }
      case 1: {
        return <span className="order-status-in-work">In Work</span>
      }
      case 2: {
        return <span className="order-status-success">Success</span>
      }
    }
  };

  fetchUserCart = () => {
    this.props.fetchUserCart ();
  };

  render () {
    const { type, cart, allCart } = this.props;
    let total = 0;
    let totalOrders = 0;

    const title = 'Cart';
    const breadcrumbs = [
      {
        name : 'Products',
        link : '/shop'
      },
      {
        name : 'Cart',
        link : '/cart'
      }
    ];
    return (
        <>{
          ( type === "mini" )
              ?
              <div className="filter-cart">
                <h3>{ title }</h3>
                { this.renderMiniCart ( cart ) }
              </div>
              : <>
                <Breadcrumbs titlePage={ title } breadcrumbs={ breadcrumbs }/>
                <div className="cart-wrapper">


                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <th colSpan={ 6 }>Current Orders</th>
                    </tr>
                    <tr className="table-header">
                      <th></th>
                      <th></th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                    {
                      ( cart )
                          ? cart.itemsGood.map ( ( i ) => {
                            total += i.qty * i.price;
                            return ( <CartLine data={ i }/> )
                          } )
                          : <tr>
                            <td colSpan={ 6 } className="no-good">Your cart is empty, put good into your cart</td>
                          </tr>
                    }
                  </table>
                  <div className="total-wrapper">
                    <span className="items-total-sum">Total&nbsp;{ filterCurrency ( total.toFixed ( 2 ) ) }</span>
                    {
                      ( !cart )
                          ? <></>
                          : <NavLink to={ `/checkout/${ cart._id }` } className="btn btn-proceed-to-checkout"><span>Proceed to Checkout</span></NavLink>
                    }
                  </div>


                  {
                    ( !allCart )
                        ? <Loader class="mini"/>
                        : <>
                          <table className="last-order">
                            <tr>
                              <th colSpan={ 4 }>All Orders</th>
                            </tr>
                            <tr className="last-order-header">
                              <td>#</td>
                              <td className="last-order-wrapper-refresh"><span>Status</span> <img src="/img/main/refresh.png" alt="refresh" className="ico ico-refresh"
                                                                                                  onClick={ this.fetchUserCart }/></td>
                              <td>Last change</td>
                              <td>Sum Of Order</td>
                            </tr>
                            {
                              allCart[ 0 ].cart.map ( ( c, idx ) => {
                                const currency = this.getSumOrder ( c.itemsGood );
                                totalOrders += currency;
                                return (
                                    <tr key={ c._id } className="line-order">
                                      <td>{ idx + 1 }</td>
                                      <td><NavLink to={ `/checkout/${ c._id }` }> { this.checkStatusOrder ( c.orderStatus ) }</NavLink></td>
                                      <td>{ moment ( c.orderDate ).format ( 'DD.MM.YYYY  HH:mm' ) }</td>
                                      <td className="currency">{ filterCurrency ( currency.toFixed ( 2 ) ) }</td>
                                    </tr>
                                )
                              } )
                            }
                            <tr className="last-order-footer">
                              <td colSpan="3" className="total">Total:</td>
                              <td>{ filterCurrency ( totalOrders.toFixed ( 2 ) ) }</td>
                            </tr>
                          </table>
                        </>
                  }

                </div>
              </>

        }</>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    cart : state.cartReducer.cart,
    allCart : state.cartReducer.allCart,
    userId : state.authReducer.user._id,
    isAuth : state.authReducer.isAuth
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    delItemFromCart : ( item, options ) => dispatch ( delItemFromCart ( item, options ) ),
    openModalWindow : ( options ) => dispatch ( openModalWindow ( options ) ),
    fetchUserCart : ( userId ) => dispatch ( fetchUserCart ( userId ) )
  }
}

export default connect ( mapStateToProps, mapDispatchToProps ) ( Cart );