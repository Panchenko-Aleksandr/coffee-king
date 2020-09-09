import React, { Component } from 'react'
import MainForm from "../../components/MainForm/MainForm";
import About from "../../components/About/About";
import RecentProducts from "../../components/RecentProducts/RecentProducts";
import Discount from "../../components/Discount/Discount";
import Footer from "../../components/Footer/Footer";

class MainLayout extends Component {
   render () {
    return (
        <>
          <MainForm/>
          <About/>
          <RecentProducts/>
          <Discount/>
          <Footer/>

          { this.props.children }
        </>
    )
  }
}


export default MainLayout;
