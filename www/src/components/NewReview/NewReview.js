import React, { Component } from 'react';
import './NewReview.scss';

import Input from 'react-validation/build/input';
import Textarea from "react-validation/build/textarea";
import Form from "react-validation/build/form";
import Button from "react-validation/build/button";

import { required } from '../../Admin/Validators';

class NewReview extends Component {
  render () {
    return (
        <Form>
          <div className="review-wrapper">
          <span className="review-information">
            Your email address will not be published. Required fields are marked *
          </span>
            <div className="review-name">
                <h5>Name<em>*</em></h5>
                <Input type="text" name="review-name-text" className="review-name-text" validations={ [required] }/>
            </div>
            <div className="review-email">
                <h5>Email<em>*</em></h5>
                <Input type="text" name="review-email-text" className="review-email-text" validations={ [required] }/>
            </div>
            <div className="review-text">
                <h5>Your review<em>*</em></h5>
                <Textarea className="review-textarea" name="review-textarea" cols="30" rows="5" validations={ [required] }/>
            </div>
            <div className="review-submit">
                <Button className="btn-submit-new-review">Submit</Button>
            </div>
          </div>
        </Form>
    )
  }
}

export default NewReview;