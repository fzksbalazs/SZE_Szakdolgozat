import React from "react";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import Slider from "../components/Slider";
import PillNav from "../components/Navbar";


const Home = () => {
  return (
    <div>
      <PillNav sharedBackground={true} />
      <Slider />

      <Categories />

      <Footer />
    </div>
  );
};

export default Home;
