import React from "react";
import Announcement from "../components/Announcement";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";
import Products from "../components/Products";
import Slider from "../components/Slider";
import PillNav from '../components/Navbar';
import { StrictMode } from "react";





const Home = () => {
  return (
    <div>
      <PillNav/>
     
      <Slider />
      <Categories />
      <Newsletter/>
      <Footer/>
    </div>
  );
};

export default Home;