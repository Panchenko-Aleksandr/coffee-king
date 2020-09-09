import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Checkout.scss';
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { NavLink, withRouter } from "react-router-dom";
import { changeOrderStatus, fetchUserCart, filterCartById } from "../../store/actions/cartAction";
import Loader from "../Loader/Loader";
import { filterCurrency, pageToUp, pageToUpAnchor } from "../../utils";
import { showModalError, showModalInformation } from "../../store/actions/layoutAction";

class Checkout extends Component {

  componentDidMount () {
    const id = this.props.match.params.cartId;
    this.props.filterCartById ( id );
    pageToUp ();
  }

  getMessageForNeOrder = () => {
    const order = document.querySelector ( '.check-item-wrapper' );
    const newOrder = document.querySelector ( '.new-order-wrapper' );
    if ( order.classList.contains ( 'active' ) ) {
      order.classList.remove ( 'active' );
      newOrder.classList.add ( 'active' );
      document.querySelector ( '.title-page' ).scrollIntoView ( {
        behavior : 'smooth',
        block : 'start'
      } )
    }
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

  changeStatus = async ( e ) => {
    const { id, orderStatus } = e.target.dataset;
    if ( orderStatus.toString () === "0" ) {
      await this.props.changeOrderStatus ( id, 1 );
    } else {
      pageToUpAnchor ( '.check-item-wrapper' );
      this.props.showModalInformation ( 'This order is already registered!' );
    }
  };

  sendOrders = async ( e ) => {
    const { id, orderStatus } = e.target.dataset;
    if ( orderStatus.toString () === "1" ) {
      await this.props.changeOrderStatus ( id, 2 );
    } else {
      pageToUpAnchor ( '.check-item-wrapper' );
      this.props.showModalError ( 'You can\'t submit this order, because the order status is not valid for this action!' );
    }
  };


  render () {
    const breadcrumbs = [
      {
        name : 'Cart',
        link : '/cart'
      },
      {
        name : 'Checkout',
        link : '/checkout'
      }
    ];
    const title = 'Checkout';


    const { cartById, userId, permission } = this.props;
    let total = 0;

    return (
        <>
          <Breadcrumbs titlePage={ title } breadcrumbs={ breadcrumbs }/>
          <div className="check-item-wrapper active">
            <h1 className="check-item-header-text">Your order</h1>
            <div className="check-status-checkout">Order is : { ( !cartById ) ? <Loader class="mini"/> : this.checkStatusOrder ( cartById.orderStatus ) }</div>
            <table className="check-item">
              <tr className="check-item-th-row">
                <th>Product</th>
                <th>Total</th>
              </tr>
              {
                ( !cartById )
                    ? <Loader/>
                    : cartById.itemsGood.map ( i => {
                      total += i.qty * i.price;
                      return (
                          <tr>
                            <td className="check-item-name">{ `${ i.good.name } × ${ i.qty }` }</td>
                            <td className="check-item-total">{ filterCurrency ( ( i.qty * i.price ).toFixed ( 2 ) ) }</td>
                          </tr>
                      )
                    } )

              }
              <tr>
                <td className="check-item-total-text"> Total</td>
                <td className="check-item-total-sum">{ filterCurrency ( total.toFixed ( 2 ) ) }</td>
              </tr>
            </table>
            <div className="check-place-order">
              {
                ( !cartById )
                    ? <Loader/>
                    : <>
                      <NavLink to={ `/cart/${ userId }` }><span className="btn btn-place-order-back">Back to cart</span></NavLink>
                      {
                        ( cartById.orderStatus === 0 )
                            ? <span
                                className="btn btn-place-order"
                                data-id={ cartById._id }
                                data-order-status={ cartById.orderStatus }
                                onClick={ this.changeStatus }
                            >Place order</span>
                            : <></>
                      }

                      {
                        ( permission === 0 )
                            ? <span
                                className="btn btn-order-send"
                                data-id={ cartById._id }
                                data-order-status={ cartById.orderStatus }
                                onClick={ this.sendOrders }
                            >Order sending</span>
                            : <></>
                      }
                    </>
              }
            </div>
          </div>


        </>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    cartById : state.cartReducer.cartById,
    userId : state.authReducer.user._id,
    permission : state.authReducer.user.permission
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    fetchUserCart : () => dispatch ( fetchUserCart () ),
    filterCartById : ( id ) => dispatch ( filterCartById ( id ) ),
    changeOrderStatus : ( id, status ) => dispatch ( changeOrderStatus ( id, status ) ),
    showModalInformation : ( msg ) => dispatch ( showModalInformation ( msg ) ),
    showModalError : ( msg ) => dispatch ( showModalError ( msg ) )
  }
}

export default withRouter ( connect ( mapStateToProps, mapDispatchToProps ) ( Checkout ) );