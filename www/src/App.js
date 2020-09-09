import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { connect } from "react-redux";
import { WOW } from 'wowjs';

import './App.scss';

import MainLayout from "./Layout/MainLayout/MainLayout";
import ShopLayout from "./Layout/ShopLayout/ShopLayout";
import Cart from "./components/Cart/Cart";
import Page404 from "./components/404/404";
import ProductLayout from "./Layout/ProductLayout/ProductLayout";
import Checkout from "./components/Checkout/Checkout";
import ContactUs from "./components/ContactUs/ContactUs";
import EditorGoods from "./Admin/EditorGoods/EditorGoods";
import EditorUsers from "./Admin/EditorUsers/EditorUsers";
import DashBoard from "./Admin/DashBoard/DashBoard";
import { pageToUp } from "./utils";
import { checkUserToken } from "./store/actions/authAction";

class App extends Component {

  componentDidMount () {
    this.props.checkUserToken ();
    const wow = new WOW (
        {
          boxClass : 'wow',      // animated element css class (default is wow)
          animateClass : 'animated', // animation css class (default is animated)
          offset : 0,          // distance to the element when triggering the animation (default is 0)
          mobile : true,       // trigger animations on mobile devices (default is true)
          live : true,       // act on asynchronously loaded content (default is true)
          callback : function ( box ) {
            // the callback is fired every time an animation is started
            // the argument that is passed in is the DOM node being animated
          },
          scrollContainer : null // optional scroll container selector, otherwise use window
        }
    );
    wow.init ();

  }

  render () {
    const { permission, isAuth } = this.props;

    let routesNotAuth = (
        <Switch>
          <Route path={ `/` } exact component={ MainLayout }/>
          <Route path={ `/shop` } exact component={ ShopLayout }/>
          <Route path={ `/shop/:goodId` } exact component={ ShopLayout }/>
          <Route path={ `/shop/category/:categoryId` } exact component={ ShopLayout }/>
          <Route path={ `/contact` } exact component={ ContactUs }/>
          <Redirect to={ `/` } component={ Page404 }/>
        </Switch>
    );

    let routes = (
        <Switch>
          <Route path={ `/` } exact component={ MainLayout }/>
          <Route path={ `/shop` } exact component={ ShopLayout }/>
          <Route path={ `/shop/:goodId` } exact component={ ShopLayout }/>
          <Route path={ `/shop/category/:categoryId` } exact component={ ShopLayout }/>
          <Route path={ `/cart` } exact component={ Cart }/>
          <Route path={ `/cart/:userId` } exact component={ Cart }/>
          <Route path={ `/checkout/:cartId` } exact component={ Checkout }/>
          <Route path={ `/contact` } exact component={ ContactUs }/>
          <Redirect to={ `/404` } component={ Page404 }/>
        </Switch>
    );

    let routesAdm = (
        <Switch>
          <Route path={ `/admin/editor-goods` } exact component={ EditorGoods }/>
          <Route path={ `/admin/editor-users` } exact component={ EditorUsers }/>
          <Route path={ `/admin/dashboard` } exact component={ DashBoard }/>

          <Route path={ `/` } exact component={ MainLayout }/>
          <Route path={ `/shop` } exact component={ ShopLayout }/>
          <Route path={ `/shop/:goodId` } exact component={ ShopLayout }/>
          <Route path={ `/shop/category/:categoryId` } exact component={ ShopLayout }/>
          <Route path={ `/cart` } exact component={ Cart }/>
          <Route path={ `/cart/:userId` } exact component={ Cart }/>
          <Route path={ `/checkout/:cartId` } exact component={ Checkout }/>
          <Route path={ `/contact` } exact component={ ContactUs }/>
          <Redirect to={ `/404` } component={ Page404 }/>
        </Switch>
    );
    // console.log ( this.props );
    // console.log ( this.props.location.pathname === '/' );

    return (
        ( this.props.location.pathname === '/' )
            ? <>{
              ( permission === 0 )
                  ? routesAdm
                  : (isAuth) ? routes : routesNotAuth
            }
            </>
            : <ProductLayout>{ ( permission === 0 ) ? routesAdm : (isAuth) ? routes : routesNotAuth }</ProductLayout>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    permission : state.authReducer.user.permission,
    isAuth : state.authReducer.isAuth
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    checkUserToken : () => dispatch ( checkUserToken () )
  }
}

export default withRouter ( connect ( mapStateToProps, mapDispatchToProps ) ( App ) );
