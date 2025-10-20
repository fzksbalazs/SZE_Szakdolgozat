import React, { useState } from "react";
import CustomButton from "./CustomButton";

const FilePicker = ({ readFile }) => {
  const [logoFile, setLogoFile] = useState(null);
  const [patternFile, setPatternFile] = useState(null);
  const [activeType, setActiveType] = useState("logo");

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setActiveType("logo");
  };

  const handlePatternUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPatternFile(file);
    setActiveType("pattern");
  };

  const handleApply = () => {
    const fileToRead = activeType === "logo" ? logoFile : patternFile;
    if (!fileToRead) return alert("Kérlek, tölts fel egy képet!");
    readFile(activeType === "logo" ? "logo" : "full", fileToRead);
  };

  const handleApplyBoth = () => {
    if (!logoFile || !patternFile)
      return alert("Tölts fel mindkét képet először!");
    readFile("full", patternFile);
    readFile("logo", logoFile);
  };

  return (
    <div className="filepicker-container flex flex-col items-start">
    
      <div className="flex flex-col flex-1 mb-3 w-full">
        <label
          className="filepicker-label text-sm font-semibold"
          htmlFor="logo-upload"
        >
          Logó feltöltése
        </label>
        <input
          id="logo-upload"
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
        />
        <p className="mt-1 text-xs text-gray-500 truncate">
          {logoFile ? logoFile.name : "Nincs logó feltöltve"}
        </p>
      </div>

     
      <div className="flex flex-col flex-1 mb-3 w-full">
        <label
          className="filepicker-label text-sm font-semibold"
          htmlFor="pattern-upload"
        >
          Minta feltöltése
        </label>
        <input
          id="pattern-upload"
          type="file"
          accept="image/*"
          onChange={handlePatternUpload}
        />
        <p className="mt-1 text-xs text-gray-500 truncate">
          {patternFile ? patternFile.name : "Nincs minta feltöltve"}
        </p>
      </div>

    
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-2">
          <button
            className={`px-4 py-1 rounded-full border transition-all duration-300 ${
              activeType === "logo"
                ? "bg-black text-white border-black"
                : "bg-transparent text-black border-gray-500"
            }`}
            onClick={() => setActiveType("logo")}
          >
            Logó
          </button>
          <button
            className={`px-4 py-1 rounded-full border transition-all duration-300 ${
              activeType === "pattern"
                ? "bg-black text-white border-black"
                : "bg-transparent text-black border-gray-500"
            }`}
            onClick={() => setActiveType("pattern")}
          >
            Minta
          </button>
        </div>

        <div className="flex flex-col gap-2 mt-3 w-full">
          <CustomButton
            type="filled"
            title="Aktuális alkalmazása"
            handleClick={handleApply}
            customStyles="text-xs w-full"
          />
          <CustomButton
            type="outline"
            title="Mindkettő alkalmazása"
            handleClick={handleApplyBoth}
            customStyles="text-xs w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default FilePicker;
