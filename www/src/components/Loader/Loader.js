import React from 'react'
import './Loader.scss';

export default props => (
    <div className={`lds-ring ${props.class}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
)
