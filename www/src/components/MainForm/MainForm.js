import React, { Component } from 'react'
import { connect } from 'react-redux';
import './MainForm.scss';
import Navigation from "../Navigation/Navigation";
import { NavLink } from "react-router-dom";

class MainForm extends Component {
  render () {
    return (
        <div className="main-container main-form" style={ { backgroundImage : "url(img/main/bg.webp)" } }>
          <div className="backdrop-container">
          </div>

          <Navigation/>

          <section className="header-section">
            <span className="title animate__animated animate__zoomInDown wow">Coffee Market</span>
            <NavLink className={ "btn btn-view-all-products animate__animated wow animate__fadeInUp" } to={ '/shop' }> View Product</NavLink>
          </section>
        </div>
    )
  }
}

export default connect () ( MainForm );