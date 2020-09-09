import React, { Component } from 'react';
import './About.scss';

class About extends Component {
  render () {
    return (
        <div className="main-container">
          <section className="about-section">
            <article id="first-about-article" className={ "animate__animated animate__zoomIn wow" }>
              <header>
                <div className="top-about-section">
                  <h2>About market</h2>
                  <h5>Следы невиданных зверей</h5>
                </div>

              </header>
              <p>Sed sagittis sodales lobortis. Curabitur in eleifend turpis, id vehicula odio. Donec pulvinar tellus egetmagna aliquet ultricies. Praesent gravida hendrerit ex,
                nec eleifend sem convallis vitae</p>
              <img src="img/main/sign-1.png" alt="sign"/>
            </article>

            <article className={ "wow animate__animated animate__slideInRight" }>
              <header>
                <div className="top-about-section">
                  <img src="/img/main/about-icon-1.png" alt=""/>
                  <h5>The best World sorts</h5>
                </div>

              </header>
              <p>Sed sagittis sodales lobortis. Curabitur in eleifend turpis, id vehicula odio. Donec pulvinar tellus eget magna aliquet ultricies.</p>
            </article>

            <article className={ "wow animate__animated animate__slideInRight" }>
              <header>
                <div className="top-about-section">
                  <img src="/img/main/about-icon-2.png" alt=""/>
                  <h5>Many points of sale</h5>
                </div>

              </header>
              <p>Sed sagittis sodales lobortis. Curabitur in eleifend turpis, id vehicula odio. Donec pulvinar tellus eget magna aliquet ultricies.</p>
            </article>

            <article className={ "wow animate__animated animate__slideInRight" }>
              <header>
                <div className="top-about-section">
                  <img src="/img/main/about-icon-3.png" alt=""/>
                  <h5>Professional baristas</h5>
                </div>

              </header>
              <p>Sed sagittis sodales lobortis. Curabitur in eleifend turpis, id vehicula odio. Donec pulvinar tellus eget magna aliquet ultricies.</p>
            </article>

            <article className={ "wow animate__animated animate__slideInRight" }>
              <header>
                <div className="top-about-section">
                  <img src="/img/main/about-icon-4.png" alt=""/>
                  <h5>24/7 fast delivery</h5>
                </div>

              </header>
              <p>Sed sagittis sodales lobortis. Curabitur in eleifend turpis, id vehicula odio. Donec pulvinar tellus eget magna aliquet ultricies.</p>
            </article>

          </section>
        </div>
    )
  }
}

export default About;