import { useState } from "react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";

import {
  AIPicker,
  ColorPicker,
  FilePicker,
  Tab,
  CustomButton,
} from "../components";

export { AIPicker, ColorPicker, FilePicker, Tab, CustomButton };

const Customizer = ({ productId }) => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatingImg, setgeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  const [size, setSize] = useState("M");
   const handleSizeChange = (event) => {
    setSize(event.target.value);
  };

  function handleSave() {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      alert("Canvas not found");
      return;
    }
    const png = canvas.toDataURL("image/png");

    const pid = productId || `custom_shirt_${Date.now()}`;
    const baseColor = snap.color;
    const isLogoTexture = state.isLogoTexture;
    const isFullTexture = state.isFullTexture;
    const selectedSize = size;

    const parentOrigin = (() => {
      try {
        return new URL(document.referrer).origin;
      } catch {
        return "*"; // fejlesztéshez jó
      }
    })();

    console.log("posting DONE to parent", { pid, baseColor, isLogoTexture, isFullTexture });

    window.parent?.postMessage(
      {
        type: "DONE",
        payload: {
          imageDataUrl: png,
          productId: pid,
          baseColor,
          isLogoTexture,
          isFullTexture,
          size: selectedSize,
        },
      },
      parentOrigin
    );
  }

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            setgeneratingImg={setgeneratingImg}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (type) => {
    if (!prompt) return alert("Please enter a prompt");

    try {
      setgeneratingImg(true);
      const response = await fetch("https://szak-3d-backend.onrender.com/api/v1/dalle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.message || `HTTP ${response.status}`);
      if (!data?.photo) throw new Error("Missing image in response");

      handleDecals(type, `data:image/png;base64,${data.photo}`);
    } catch (error) {
      console.error("AI generate error:", error);
      alert(`AI generate failed: ${error.message || error}`);
    } finally {
      setgeneratingImg(false);
      setActiveEditorTab("");
    }
  };

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    setActiveFilterTab((prevState) => ({
      ...prevState,
      [tabName]: !prevState[tabName],
    }));
  };

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  return (
   
    <AnimatePresence>
      {!snap.intro && (
        <>
          {/* Bal oldali tabok */}
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}
                {generateTabContent()}
              </div>
              
            </div>

            
          </motion.div>

          {/* Vissza gomb bal felül */}
          <motion.div
            className="absolute z-10 top-5 left-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Vissza"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          {/* Megrendelés gomb jobb felül */}
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Megrendelés"
              handleClick={handleSave}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          

          {/* Filter tabok és letöltés */}
          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
             

            <button className="download-btn" onClick={downloadCanvasToImage}>
              <img
                src={download}
                alt="download_image"
                className="object-contain w-3/5 h-3/5"
              />
            </button>
<motion.div>
        <label className= "p-3" htmlFor="size"></label>
        <select id="size" value={size} onChange={handleSizeChange} className="p-2 text-xl bg-transparent rounded-full">
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </motion.div>
            
          </motion.div>
        </>
      )}
      
    </AnimatePresence>
  );
};

export default Customizer;
