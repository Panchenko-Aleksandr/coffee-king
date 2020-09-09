import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Footer.scss';
import Modal from "../../Admin/Modal/Modal";
import { closeModalWindow } from "../../store/actions/layoutAction";
import M from 'materialize-css';
import { withRouter } from "react-router-dom";

class Footer extends Component {

  componentDidUpdate ( prevProps, prevState, snapshot ) {

    if ( this.props.Modal.isShow ) {
      const modal = document.querySelector ( '.modal-frame' );
      if ( modal ) {
        const options = {
          onCloseEnd : this.props.closeModalWindow
        };
        M.Modal.init ( modal, options );
        const instance = M.Modal.getInstance ( modal );
        instance.open ();
      }
    }

  }

  componentDidMount () {
    const arrowTop = document.querySelector ( '.up-arrow' );
    window.addEventListener ( 'scroll', function () {
      arrowTop.hidden = ( window.pageYOffset < 300 );
    } );

  }

  toUpPage = () => {
    document.querySelector ( '.nav-header' ).scrollIntoView ( {
      behavior : 'smooth',
      block : 'start'
    } )
  };

  render () {

    return (

        <footer>
          <div className="footer-container">
            <div className="left-side-logo">
              <img src="/img/main/logo.png" alt=""/>
              <p>󠁶󠁵󠁭󠁡󠁰󠁿 Pellentesque congue non augue vitae pellentesque. Morbi sollicitudin eleifend rhoncus. Mauris vel nisl a massa viverra sollicitudin semper a
                diam.</p>
            </div>
            <div className="explore">
              <h4>EXPLORE</h4>
              <ul>
                <li>Home</li>
                <li>Contact us</li>
                <li>Products</li>
              </ul>
            </div>
            <div className="contact-us">
              <h4>Contact Us</h4>
              <ul>
                <li><img src="/img/main/geo-white.png" alt=""/><p>44 Danwers, NY City, USA, 70-102</p></li>
                <li><img src="/img/main/phone-white.png" alt=""/><p>+10800-33-800; +10500-55-900</p></li>
                <li><img src="/img/main/email-white.png" alt=""/><a href="mailto:mycoffee@mycoffeeshop.us">mycoffee@mycoffeeshop.us</a></li>
                <li></li>
              </ul>
            </div>
          </div>
          <div className="copyright">
            CoffeeKing © All Rights Reserved - 2020
          </div>
          <span className="up-arrow" hidden onClick={ this.toUpPage }><img src="/img/slider/next-arrow.svg" alt=""/></span>
          {
            ( this.props.Modal?.isShow )
                ? <>
                  <Modal
                      fnAgree={ this.props.closeModalWindow }
                  />
                </>
                : null
          }
        </footer>


    )
  }
}

function mapStateToProps ( state ) {
  return {
    Modal : state.layoutReducer.Modal
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    closeModalWindow : () => dispatch ( closeModalWindow () )
  }
}

export default withRouter ( connect ( mapStateToProps, mapDispatchToProps ) ( Footer ) );