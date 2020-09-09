import React, { Component } from 'react'
import Footer from "../../components/Footer/Footer";
import Navigation from "../../components/Navigation/Navigation";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import Shop from "../../container/Shop/Shop";
import ShopItem from "../../container/ShopItem/ShopItem";
import { withRouter } from "react-router-dom";

class MainLayout extends Component {

  render () {
    const { goodId } = this.props.match.params;

    const titlePage = 'All Products';

    const breadcrumbs = [
      {
        name : 'Products',
        link : '/shop'
      }
    ];

    return (
        <>

          <Breadcrumbs titlePage={ titlePage } breadcrumbs={ breadcrumbs }/>

          {
            !goodId
                ? <Shop/>
                : <ShopItem/>
          }


        </>
    )
  }
}


function mapStateToProps (state) {
   return {

   }
}

function mapDispatchToProps (dispatch) {
    return {

    }
}


export default withRouter ( MainLayout );

