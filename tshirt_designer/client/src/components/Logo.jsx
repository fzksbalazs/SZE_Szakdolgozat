import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useSnapshot } from "valtio";
import state from "../store"; 

const Logo = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/"); 
  };

  return (
    <motion.div
      className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center"
      style={{ position: "absolute" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={handleLogoClick} 
    >
      <img
        src="/logo" 
        alt="Wearable Logo"
        className="object-contain w-1/4 cursor-pointer h-1/4"
      />
    </motion.div>
  );
};

export default Logo;
