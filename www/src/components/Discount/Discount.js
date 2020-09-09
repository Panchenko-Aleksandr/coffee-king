import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Discount.scss';
import { changeShowAuth } from "../../store/actions/authAction";


class Discount extends Component {

  handleOpenAuthForm = () => {
    if ( !this.props.isAuth ) {
      this.props.changeShowAuth ();
    }
  };

  render () {

    const { isAuth } = this.props;

    return (
        <div className="main-container" style={ { height : 'initial' } }>
          <section className="get-discount">
            <header className="discount-header">
              <figure>
                <img src="/img/main/discount/restaurants.png" alt="" className="wow"/>
                <img src="/img/main/discount/vintage.png" alt="" className="wow"/>
                <img src="/img/main/discount/cupcake.png" alt="" className="wow"/>
                <img src="/img/main/discount/coffe_logo2.png" alt="" className="wow"/>
                <img src="/img/main/discount/bakery.png" alt="" className="wow"/>
                <img src="/img/main/discount/brandit.png" alt="" className="wow"/>
              </figure>
            </header>
            <div className="body">
              <div className="body-left">
                <article>
                  <header>
                    <h5>Special offer</h5>
                    <h2>Get your discount</h2>
                  </header>
                  <div className="discount-article-body">
                    <figure className="wow">
                      <img src="/img/main/discount/card.png" alt=""/>
                    </figure>
                    <p>Morbi malesuada dui in iaculis lacinia. Duis laoreet ut liberonec tincidunt. Maecenas a eros finibus, condimentum tortoreget, auctor nunc. Aenean a efficitur
                      leo.</p>
                  </div>
                  {
                    ( !isAuth )
                        ? <span className="btn-get-now" onClick={this.handleOpenAuthForm}>Get Discount</span>
                        : <span className="btn-hav-discount">Your have discount !!!</span>
                  }

                </article>
              </div>
              <div className="body-right">

              </div>
            </div>
          </section>
        </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    isAuth : state.authReducer.isAuth
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    changeShowAuth : () => dispatch ( changeShowAuth () )
  }
}

export default connect ( mapStateToProps, mapDispatchToProps ) ( Discount );