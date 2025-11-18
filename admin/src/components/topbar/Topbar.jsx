import React from "react";
import "./topbar.css";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/userRedux";

export default function Topbar() {
  localStorage.clear();
  const dispatch = useDispatch();
  const handleLogout = (e) => {
    dispatch(logout());
  
  }

  


  return (
    
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">WEARABLE. - ADMIN OLDAL</span>
        </div>
        <div className="topRight">
         
         <a onClick={(e) => handleLogout(e)} href="/login"  className="logout">KIJELENTKEZÉS</a>
         
        </div>
      </div>
    </div>
  );
}


