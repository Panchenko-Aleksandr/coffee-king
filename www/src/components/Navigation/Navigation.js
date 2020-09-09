import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom";

import './Navigation.scss';
import './Hamburger.scss';

import { changeShowAuth, checkUserToken, logout } from "../../store/actions/authAction";
import Auth from "../Auth/Auth";
import { changeVisibilitySideBar, openModalWindow } from "../../store/actions/layoutAction";

class Navigation extends Component {
  state = {
    showSearch : false,
    showAuth : false
  };


  componentDidMount () {
    this.props.checkUserToken ();
  }

  handlerChangeStateSearch = () => {
    document.querySelector ( '.backdrop-search' ).classList.add ( 'active' );
    this.setState ( { showSearch : !this.state.showSearch } );
  };

  handlerChangeAuth = () => {
    this.setState ( { showAuth : !this.state.showAuth } );
  };

  closeBackdrop = () => {
    this.setState ( { showSearch : false } );
    document.querySelector ( '.backdrop-search' ).classList.remove ( 'active' );
  };

  handleStartSearch = ( e ) => {
    if ( e.key === 'Enter' ) {
      console.log ( 'начался поиск!' );
      this.closeBackdrop ();
    }
  };

  authForm = () => {
    if ( !this.props.isAuth ) {
      this.props.changeShowAuth ();
      this.props.changeVisibilitySideBar(false);
    }
  };

  logout = () => {
    const options = {
      id : 'modalQuestBeforeDeleteOrder',
      type : 'Confirmation',
      title : "Подтверждение",
      text : `Are you confirm logout?`,
      fnAgree : this.logoutRefresh,
    };
    this.props.openModalWindow ( options );
  };

  logoutRefresh = () => {
    this.props.logout ();
    this.props.changeVisibilitySideBar(false);
  };

  toggleBurgerMenu = ( e ) => {
    this.props.changeVisibilitySideBar();
  };

  // toggleMenu = () => {
  //   const wrapperBurgerMenu = document.querySelector ( '.burger-menu-wrapper' );
  //   wrapperBurgerMenu.classList.toggle ( 'hide' );
  //
  //   const $el = document.querySelector ( '.menu-icon' );
  //   $el.classList.toggle ( 'clicked' );
  // };

  render () {
    const { showSearch, showAuth } = this.state;
    const { logoBlack, showAuthForm, isAuth, user, cart, sideBar } = this.props;

    const classNavlLink = logoBlack ? "nav-link-black" : "";
    return (
        <div className="nav-header">

          {
            showAuthForm
                ? <Auth/>
                : <></>
          }

          <div className="logo">
            <img src={ `${ logoBlack ? '/img/main/logo_black.png' : "/img/main/logo.png" }` } alt="LOGO"/>
          </div>
          <div className="menu-wrapper">

            {

              ( user.permission === 0 )
                  ? <nav className="menu-new">
                    <li className={ `main-menu-new-item ${ logoBlack ? 'white' : '' }` }>Администрирование
                      <ul className="menu-new-item-wrapper">
                        <li><NavLink to="/admin/editor-goods" className={ classNavlLink }>Редактор товаров</NavLink></li>
                        <li><NavLink to="/admin/editor-users" className={ classNavlLink }>Пользователи</NavLink></li>
                      </ul>
                    </li>
                  </nav>
                  : <></>
            }


            <nav>
              <li><NavLink to="/" className={ classNavlLink }>Home</NavLink></li>
              <li><NavLink to="/shop" className={ classNavlLink }>Products</NavLink></li>
              <li><NavLink to="/contact" className={ classNavlLink }>Contact us</NavLink></li>
            </nav>

            <ul>
              {
                ( !isAuth )
                    ? <></>
                    : <li className="wrapper-cart">
                      <NavLink to={ `/cart` } className={ classNavlLink } >
                  <span className="count">
                    {
                      ( cart )
                          ?
                          ( cart.length >= 0 )
                              ? `${ cart.length }`
                              : 0
                          : <>0</>
                    }
                  </span>
                        <span className="cart">
                    <img src={ `${ logoBlack ? '/img/main/cart.png' : "/img/main/cart_white.png" }` } alt=""/>
                  </span>
                      </NavLink>
                    </li>
              }
              <li className="wrapper-search">
                <div className="backdrop-search" onClick={ () => {
                  this.closeBackdrop ()
                } }/>
                <input type="text" className={ `search-str ${ showSearch ? 'show' : '' }` } onKeyPress={ this.handleStartSearch }/>
                <span className="search-btn" style={ { display : 'none' } }> onClick={ this.handlerChangeStateSearch }>
                  <img src={ `${ logoBlack ? "/img/main/search.png" : "/img/main/search_white.png" }` } alt="Search"/>
                </span>
              </li>
              <li>
                <span className="auth" onClick={ this.authForm }>
                  <div className="nav-auth-wrapper">
                  {
                    ( !isAuth )
                        ? <img src={ `${ logoBlack ? "/img/main/auth.png" : "/img/main/auth_white.png" }` } className="auth-img" alt=""/>
                        : <img src={ "/img/main/auth_success.png" } className="auth-img" alt="" title={ user.name } onClick={ this.logout }/>
                  }
                  </div>
                </span>
              </li>
            </ul>
          </div>

          <div className={`burger-menu-wrapper ${!sideBar.isShow ? 'hide' : ''}`}>
            <div className={`menu-icon ${!sideBar.isShow ? '' : 'clicked'}`} onClick={ this.toggleBurgerMenu }>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <ul className="phone-menu">
              <li>
                <ul className="phone-menu-auth-cart">
                  <li>
                    {
                      ( !true )
                          ? <></>
                          : <div className="wrapper-cart">
                            <NavLink to={ `/cart` } className={ classNavlLink } onClick={ this.toggleBurgerMenu }>
                                <span className="count">
                                  {
                                    ( cart )
                                        ?
                                        ( cart.length >= 0 )
                                            ? `${ cart.length }`
                                            : 0
                                        : <>0</>
                                  }
                                </span>
                              <span className="cart">
                                <img src={ `/img/main/cart_white.png` } alt=""/>
                              </span>
                            </NavLink>
                          </div>
                    }
                  </li>
                  <li>
                       <span className="auth" onClick={ this.authForm }>
                          <div className="nav-auth-wrapper">
                          {
                            ( !isAuth )
                                ? <img src={ `/img/main/auth_white.png` } className="auth-img" alt=""/>
                                : <img src={ "/img/main/auth_success.png" } className="auth-img" alt="" title={ user.name } onClick={ this.logout }/>
                          }
                          </div>
                        </span>
                  </li>
                </ul>

              </li>
              <li><NavLink to="/" className={ classNavlLink } onClick={ this.toggleBurgerMenu }>Home</NavLink></li>
              <li><NavLink to="/shop" className={ classNavlLink } onClick={ this.toggleBurgerMenu }>Products</NavLink></li>
              <li><NavLink to="/contact" className={ classNavlLink } onClick={ this.toggleBurgerMenu }>Contact</NavLink></li>
            </ul>
          </div>

        </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    showAuthForm : state.authReducer.showAuthForm,
    isAuth : state.authReducer.isAuth,
    isAdmin : state.authReducer.isAdmin,
    user : state.authReducer.user,
    cart : state.cartReducer.cart?.itemsGood,
    sideBar : state.layoutReducer.SideBar
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    changeShowAuth : () => dispatch ( changeShowAuth () ),
    checkUserToken : () => dispatch ( checkUserToken () ),
    logout : () => dispatch ( logout () ),
    openModalWindow : ( options ) => dispatch ( openModalWindow ( options ) ),
    changeVisibilitySideBar : ( type ) => dispatch ( changeVisibilitySideBar ( type ) )
  }
}

export default withRouter ( connect ( mapStateToProps, mapDispatchToProps ) ( Navigation ) );