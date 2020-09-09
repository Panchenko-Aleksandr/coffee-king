import React, { Component } from 'react';
import { connect } from 'react-redux';

import './EditorUsers.scss';
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import EditBtnUsers from "./EditBtnUsers/EditBtnUsers";
import { fetchAllUsers, setSearchStr } from "../../store/actions/userAction";
import Loader from "../../components/Loader/Loader";
import { filterCurrency } from "../../utils";
import CartListOfUser from "../../components/Cart/CartListOfUser";


class EditorUsers extends Component {
  state = {
    isOpen : false
  };

  componentDidMount () {
    this.props.fetchAllUsers ();
  }

  toggleModal = () => {
    this.setState ( { isOpen : !this.state.isOpen } );
  };

  handleSearchUser = ( e ) => {
    const { searchField } = e.target.dataset;
    this.props.setSearchStr ( searchField, e.target.value );
    this.props.fetchAllUsers ();
  };

  calculateSpentMoneyUser = ( cart ) => {
    const finalOrders = cart.filter ( c => c.orderStatus >= 1 );

    const totalSum = finalOrders.reduce ( ( sum, cart ) => {

      const tempSum = cart.itemsGood.reduce ( ( tempSumCart, good ) => {
        return tempSumCart += good.qty * good.price;
      }, 0 );

      return sum += tempSum;
    }, 0 );

    return filterCurrency ( totalSum.toFixed ( 2 ) );
  };

  calculateWaitOrdersUser = ( cart ) => {
    const finalOrders = cart.filter ( c => c.orderStatus === 0 );

    const totalSum = finalOrders.reduce ( ( sum, cart ) => {

      const tempSum = cart.itemsGood.reduce ( ( tempSumCart, good ) => {
        return tempSumCart += good.qty * good.price;
      }, 0 );

      return sum += tempSum;
    }, 0 );

    return `${ finalOrders.length } / ${ filterCurrency ( totalSum.toFixed ( 2 ) ) }`;
  };

  toggleDataOrders = ( e ) => {
    e.preventDefault ();
    const id = e.target.dataset.id;
    const $el = document.querySelector ( `.cart-list-wrapper-${ id }` );

    if ( $el ) {
      if ( $el.classList.contains ( 'hide' ) ) {
        $el.classList.remove ( 'hide' );
      } else {
        $el.classList.add ( 'hide' );
      }
    }

  };

  changePassword = ( e ) => {

  };

  toggleChangePass = ( e ) => {
    e.preventDefault ();
    const id = e.target.dataset?.id;
    const $el = document.querySelector ( `.change-pass-${ id }` );

    console.log ( 'type', e.target.dataset?.type )

    if ( e.target.dataset?.type === 'close' ) {
      $el.classList.add ( 'hide' );
    } else {
      $el.classList.remove ( 'hide' );
    }

  };

  getUserById = ( userId ) => {
    return this.props.users.filter ( u => u._id === userId )
  };

  render () {
    const { users } = this.props;
    const title = 'Редактор пользователей';
    const breadcrumbs = [
      {
        name : 'Редактор пользователей',
        link : '/editor-users'
      }
    ];


    return (
        <div>
          <Breadcrumbs titlePage={ title } breadcrumbs={ breadcrumbs }/>

          <div className="editor-user-container">
            <table>
              <tr className="th-table">
                <td>#</td>
                <td>Login <br/> (click for change password)</td>
                <td>Name</td>
                <td>Email</td>
                <td>Spent</td>
                <td>WaitOrder(s)<br/> qty/sum</td>
                <td>Адрес</td>
              </tr>
              <tr className="th-search-field">
                <td></td>
                <td>
                  <input type="text" data-search-field="login" onChange={ this.handleSearchUser }/>
                </td>
                <td>
                  <input type="text" data-search-field="name" onChange={ this.handleSearchUser }/>
                </td>
                <td>
                  <input type="text" data-search-field="email" onChange={ this.handleSearchUser }/>
                </td>
                <td colSpan="3"></td>
              </tr>

              {
                ( users )
                    ? users.map ( ( i, idx ) => {
                      console.log ( 'i', i );
                      return (
                          <tr className="tr-user-line">
                            <td>{ idx + 1 }</td>
                            <td>
                              <div data-id={ i._id } className="login-change-pass" data-type={ 'open' } onClick={ this.toggleChangePass }>
                                { i.login }
                                <div className={ `change-pass hide change-pass-${ i._id }` }>
                                  <label>Enter new password
                                    <input type="text" className={ `change-pass-new-pass new-pass-${ i._id }` }/>
                                    <span data-id={ i._id } onClick={ this.changePassword }>Change pass</span>
                                    <span data-id={ i._id } data-type={ 'close' } onClick={ this.toggleChangePass }>Cancel</span>
                                  </label>
                                </div>
                              </div>
                            </td>
                            <td>{ i.name }</td>
                            <td>{ i.email }</td>
                            <td>{ this.calculateSpentMoneyUser ( i.cart ) }</td>
                            <td>
                              <span className="show-wait-orders" data-id={ i._id } onClick={ this.toggleDataOrders }> { this.calculateWaitOrdersUser ( i.cart ) }</span>
                              <div className={ `cart-list-wrapper cart-list-wrapper-${ i._id } hide` } data-id={ i._id } onClick={ this.toggleDataOrders }>
                                <CartListOfUser list={ this.getUserById ( i._id ) }/>
                              </div>
                            </td>
                            <td>{ i.addressDelivery }</td>
                          </tr>
                      )
                    } )
                    : <Loader/>
              }

            </table>
          </div>
        </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    users : state.userReducer.users
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    fetchAllUsers : () => dispatch ( fetchAllUsers () ),
    setSearchStr : ( param, str ) => dispatch ( setSearchStr ( param, str ) )
  }
}

export default connect ( mapStateToProps, mapDispatchToProps ) ( EditorUsers );
