import React from "react";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import Slider from "../components/Slider";
import PillNav from "../components/Navbar";
import { useSelector } from "react-redux"; // ⬅ szükséges

const Home = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  // VERCEL admin URL-ed ide jön:
   const adminUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:3001"
      : "https://adminoldal.vercel.app";

  return (
    <div style={{ position: "relative" }}>
      
      {currentUser?.isAdmin && (
        <a
          href={adminUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            padding: "10px 16px",
            background: "#5e0cc4",
            color: "white",
            borderRadius: "8px",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            textDecoration: "none",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#7a22f0")}
          onMouseOut={(e) => (e.target.style.background = "#5e0cc4")}
        >
          Admin panel →
        </a>
      )}

      <PillNav sharedBackground={true} />
      <Slider />
      <Categories />
      <Footer />
    </div>
  );
};

export default Home;
