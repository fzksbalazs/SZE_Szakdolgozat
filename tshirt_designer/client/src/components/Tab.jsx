import React from "react";
import { useSnapshot } from "valtio";

import state from "../store";

const Tab = ({ tab, isFilterTab, isActiveTab, handleClick }) => {
  const snap = useSnapshot(state);

  // Vercel felismerése
  const isVercel =
    typeof window !== "undefined" &&
    window.location.hostname.includes("vercel.app");

  // Csak az AI tab legyen tiltva
  const isDisabled = isVercel && tab.name === "aipicker";

  // Ha tiltott tab-ra kattint → popup
  const handleDisabledClick = () => {
    if (isDisabled) {
      alert(
        "Az AI generálás funkció átmenetileg kizárólag helyi környezetben érhető el.\nA Vercel verzióban biztonsági okokból le van tiltva."
      );
    }
  };

  const activeStyles =
    isFilterTab && isActiveTab
      ? { backgroundColor: "black", opacity: 0.5 }
      : { backgroundColor: "transparent", opacity: 1 };

  return (
    <div
      key={tab.name}
      className={`
        tab-btn 
        ${isFilterTab ? "rounded-full glassmorphism" : "rounded-4"}
        ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
      `}
      style={activeStyles}
      onClick={isDisabled ? handleDisabledClick : handleClick}
      title={isDisabled ? "AI funkció csak lokálisan elérhető" : ""}
    >
      <img
        src={tab.icon}
        alt={tab.name}
        className={`${
          isFilterTab ? "w-2/3 h-2/3" : "w-11/12 h-11/12 object-contain"
        }`}
      />
    </div>
  );
};

export default Tab;
