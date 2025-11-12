import React from "react";
import state from "../store";
import { useSnapshot } from "valtio";

import { getContrastingColor } from "../config/helpers";

function CustomButton({ type, customStyles, handleClick, title }) {
  const snap = useSnapshot(state);

  const generateStyle = (type) => {
    if (type === "filled") {
      return {
        backgroundColor: "black",
        color: "white",
      };
    } else if (type === "outline") {
      return {
        border: "1px solid black",
        color: "black",
      };
    }
  };

  return (
    <button
      className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`}
      style={generateStyle(type)}
      onClick={handleClick}
    >
      {title}
    </button>
  );
}

export default CustomButton;
