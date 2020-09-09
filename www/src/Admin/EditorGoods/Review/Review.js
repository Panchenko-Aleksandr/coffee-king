import React, { Component } from 'react';
import './Review.scss';

class Review extends Component {
  render () {
    const { goodId } = this.props;
    return (
        <>
          {
            ( goodId === 0 )
                ?
                <div className="review-backdrop">
                  <div className="no-review-goods"/>
                </div>
                : <></>
          }
        </>
    )
  }
}

export default Review;