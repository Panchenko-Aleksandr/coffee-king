import React from 'react';
import './ContactUs.scss';
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

const breadcrumbs = [
  {
    name : 'Contact',
    link : '/contact'
  }
];

export default props => (
    <>
      <Breadcrumbs titlePage={ "Contact" } breadcrumbs={ breadcrumbs }/>
      <div className="contact-wrapper">
        <div className="contact-description">
          <h3>Central Office</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores minus modi pariatur recusandae suscipit! At consectetur corporis cum cumque dignissimos ea eius error
            exercitationem fugit necessitatibus nihil non numquam odio omnis pariatur provident, quaerat quibusdam quis quod reiciendis? Beatae eveniet explicabo fuga fugiat id
            libero modi necessitatibus odit sequi suscipit.</p>
          <span className="contact-phone"><img src="/img/main/phone.png" alt=""/><p>0(800)89-90-609</p></span>
          <span className="contact-address"><img src="/img/main/geo.png" alt=""/><p>29 NICOLAS STR, NEW YORK, 987597-50</p></span>
          <span className="contact-email"><img src="/img/main/email.png" alt=""/><a href="mailto:mycoffee@mycoffeeshop.us">mycoffee@mycoffeeshop.us</a></span>
        </div>
        <div className="contact-opening-hours">
          <div className="sq-border">
            <h2>Opening Hours</h2>
            <div className="work-time">
              <span><strong>Monday:</strong><p>09:00 - 19:00</p></span>
              <span><strong>Tuesday:</strong><p>09:00 - 19:00</p></span>
              <span><strong>Wednesday:</strong><p>09:00 - 19:00</p></span>
              <span><strong>Thursday:</strong><p>09:00 - 19:00</p></span>
              <span><strong>Friday:</strong><p>09:00 - 19:00</p></span>
              <span><strong>Saturday:</strong><p>11:00 - 16:00</p></span>
              <span><strong>Sunday:</strong>CLOSED</span>
            </div>
          </div>

        </div>
      </div>
    </>
)
