import React, { Component } from 'react'
import './Breadcrumbs.scss';
import { NavLink } from "react-router-dom";

class Breadcrumbs extends Component {
  render () {
    const {titlePage, breadcrumbs} = this.props;
    return (
        <>
          <div className="breadcrumbs">
            <span className="title-page">{ titlePage }</span>
            <ul>
              <li className="mainLink"><NavLink to="/">CoffeeKing</NavLink></li>
              {
                breadcrumbs.map ( ( i, idx ) => {
                  return (
                      <li key={ idx }>
                        {
                          ( breadcrumbs.length !== idx + 1 )
                              ? <NavLink to={ i.link }><span>&gt;</span>&nbsp;{ i.name }</NavLink>
                              : <><span>&gt;</span>&nbsp;{ i.name }</>
                        }
                      </li>
                  )
                } ) }
            </ul>
          </div>
        </>
    )
  }
}

export default Breadcrumbs;