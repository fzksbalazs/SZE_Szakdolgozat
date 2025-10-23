import { useState, useRef, useEffect } from "react";
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
  const tabRef = useRef(null);

  const [file, setFile] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatingImg, setgeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });
  const [size, setSize] = useState("M");

  // ✅ A helyes helye ennek a useEffect-nek
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isMobile = window.innerWidth <= 768;
      if (
        isMobile &&
        activeEditorTab &&
        tabRef.current &&
        !tabRef.current.contains(event.target)
      ) {
        setActiveEditorTab("");
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 768 && activeEditorTab) {
        setActiveEditorTab("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeEditorTab]);

  const handleSizeChange = (event) => setSize(event.target.value);

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
        return "*";
      }
    })();

    window.parent?.postMessage(
      {
        type: "DONE",
        payload: {
          imageDataUrl: png,
          productId: pid,
          baseColor: state.color,
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
      const response = await fetch("http://localhost:8080/api/v1/dalle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(data?.message || `HTTP ${response.status}`);
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

  const readFile = (type, customFile = null) => {
    const targetFile = customFile || file;
    if (!targetFile) return alert("Nincs kiválasztott kép!");

    reader(targetFile).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div ref={tabRef} className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() =>
                      setActiveEditorTab((prev) =>
                        prev === tab.name ? "" : tab.name
                      )
                    }
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div className="absolute z-10 top-5 left-5" {...fadeAnimation}>
            <CustomButton
              type="filled"
              title="Vissza"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

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

          <motion.div
            className="fixed z-50 flex flex-col-reverse items-end gap-3 sm:flex-row sm:items-center sm:gap-4 bottom-5 right-5"
            {...fadeAnimation}
          >
            <select
              id="size"
              value={size}
              onChange={handleSizeChange}
              className="p-2 text-base text-black transition-all bg-white rounded-full shadow-md cursor-pointer bg-opacity-70 sm:p-2 sm:text-sm hover:bg-white"
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>

            <CustomButton
              type="outline"
              title="Forgatás"
              handleClick={() => {
                if (typeof state.startPreview === "function")
                  state.startPreview();
              }}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm cursor-pointer shadow-md bg-white/70 hover:bg-white rounded-full transition-all"
            />
          </motion.div>

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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
