import React, { Component } from 'react'
import { connect } from 'react-redux';

import Navigation from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer/Footer";
import './ProductLayout.scss';

class ProductLayout extends Component {
  render () {

    return (
        <div className="cf-container">
          <header>
            <div className="main-container" style={ { height : 'initial' } }>
              <Navigation logoBlack/>
            </div>
          </header>

          <div className="main-content">{ this.props.children }</div>

          <Footer/>

        </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {}
}

function mapDispatchToProps ( dispatch ) {
  return {}
}

export default connect ( mapStateToProps, mapDispatchToProps ) ( ProductLayout );
