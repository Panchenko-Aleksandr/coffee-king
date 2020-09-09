import React, { Component } from 'react'
import moment from "moment";
import { connect } from 'react-redux';
import './CartListOfUser.scss';

import { filterCurrency } from "../../utils";
import { NavLink } from "react-router-dom";
import Loader from "../Loader/Loader";

class CartListOfUser extends Component {

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

  render () {

    const { list } = this.props;
    let totalOrders = 0;

    console.log ( 'list', list );

    return (

        <table className="cart-list-of-user">
          <tr className="last-order-header">
            <td>#</td>
            <td className="last-order-wrapper-refresh"><span>Status</span></td>
            <td>Last change</td>
            <td>Sum Of Order</td>
          </tr>
          {

            ( !list )
                ? <Loader/>
                : list[ 0 ].cart.map ( ( c, idx ) => {
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

    )
  }
}

function mapStateToProps ( state ) {
  return {
    users : state.userReducer.users
  }
}

function mapDispatchToProps ( dispatch ) {
  return {}
}

export default connect ( mapStateToProps, mapDispatchToProps ) ( CartListOfUser );
