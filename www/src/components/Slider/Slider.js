import React, { Component } from 'react'
import SlickSlider from 'react-slick'

// // Import css files
import "slick-carousel/slick/slick.scss"
import "slick-carousel/slick/slick-theme.scss"

//Local Css
import "./Slider.scss"
import Loader from "../Loader/Loader";
import SliderItem from "../ItemSlider/SliderItem";

function NextArrow ( props ) {
  const { className, style, onClick, type } = props;

  let newStyle = {
    zIndex : "5"
  };

  let classNameArrow = className;

  function prepareNextArrowSlider () {
    let classArrow = [...className.split ( " " )].indexOf ( 'slick-next' );
    classNameArrow = [...className.split ( " " ), 'slick-next-custom'];
    classNameArrow.splice ( classArrow, 1 );
    classNameArrow = classNameArrow.join ( " " )
  }

  switch ( type ) {
    case 'GoodOfDay' : {
      prepareNextArrowSlider ();
      newStyle = { ...newStyle, right : "10px", top : "37%", width : "25px", height : "25px" };
      break
    }
    case 'Goods' : {
      newStyle = { ...newStyle, right : "-16px" };
      let classArrow = [...className.split ( " " )].indexOf ( 'slick-next' );
      classNameArrow = [...className.split ( " " ), 'slick-next-custom', 'slick-next-custom-round'];
      classNameArrow.splice ( classArrow, 1 );
      classNameArrow = classNameArrow.join ( " " );
      break;
    }
    default : {
      prepareNextArrowSlider ();
      newStyle = { ...newStyle, right : "10px", top : "49%", width : "25px", height : "25px" };
      break;
    }
  }
  return (
      <div
          className={ classNameArrow }
          style={ { ...style, ...newStyle } }
          onClick={ onClick }
      />
  );
}

function PrevArrow ( props ) {
  const { className, style, onClick, type } = props;

  let newStyle = {
    zIndex : "5"
  };

  let classNameArrow = className;

  function preparePrevArrowSlider () {
    let classArrow = [...className.split ( " " )].indexOf ( 'slick-prev' );
    classNameArrow = [...className.split ( " " ), 'slick-prev-custom'];
    classNameArrow.splice ( classArrow, 1 );
    classNameArrow = classNameArrow.join ( " " );
  }

  switch ( type ) {
    case 'GoodOfDay' : {
      preparePrevArrowSlider ();
      newStyle = { ...newStyle, left : "10px", top : "37%", width : "25px", height : "25px" };
      break;
    }

    case 'Goods' : {
      let classArrow = [...className.split ( " " )].indexOf ( 'slick-prev' );
      classNameArrow = [...className.split ( " " ), 'slick-prev-custom', 'slick-prev-custom-round'];
      classNameArrow.splice ( classArrow, 1 );
      classNameArrow = classNameArrow.join ( " " );
      newStyle = { ...newStyle, left : "-12px" };
      break
    }

    default : {
      preparePrevArrowSlider ();
      newStyle = { ...newStyle, left : "10px", top : "49%", width : "25px", height : "25px" };
      break
    }
  }

  return (
      <div
          className={ classNameArrow }
          style={ { ...style, ...newStyle } }
          onClick={ onClick }
      />
  );
}


export default class Slider extends Component {

  renderSlide = () => {
    return this.props.slides.map ( slide => {
          if ( slide.isActive ) {
            return (
                <>
                  <SliderItem slide={ slide }/>
                </> )
          }
        }
    )
  };

  customPaging = ( i ) => {
    switch ( this.props.typeSlider ) {
      case 'GoodOfDay': {
        return <span>{ i + 1 }</span>
      }
      default : {
        return <button>{ i + 1 }</button>
      }
    }
  };

  render () {
    const { dots, autoplay, infinite, slidesToShow, slidesToScroll, typeSlider, initialSlide } = this.props;

    const settings = {
      dots : dots,
      initialSlide : initialSlide,
      arrows : true,
      infinite : infinite,
      slidesToShow : slidesToShow,
      slidesToScroll : slidesToScroll,
      swipeToSlide : true,
      autoplay : autoplay,
      speed : 500,
      rows : 1,
      vertical : false,
      centerMode : true,
      autoplaySpeed : 5000,
      cssEase : "linear",
      nextArrow : <NextArrow type={ typeSlider }/>,
      prevArrow : <PrevArrow type={ typeSlider }/>,
      customPaging : this.customPaging
    };

    return (
        <div style={ { width : this.props.width, cursor : "pointer", marginLeft : this.props.marginLeft } }>


          {
            this.props.slides === undefined
                ? <Loader/> : <SlickSlider { ...settings }>  { this.renderSlide () }  </SlickSlider>
          }


        </div>
    );
  }
}

