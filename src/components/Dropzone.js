import React from "react";
import "./global.css";
import IconService from "icon-sdk-js";

const { IconConverter, IconBuilder } = IconService;
const Dropzone = () => {
  //modal things
  const handleDropEvent = (event) => {
    console.log("hello world");
    event.preventDefault();

    console.log(event);
  };

  return (
    <div
      style={{
        padding: "25px 25px",
        border: "1px solid #5d2985",
        borderRadius: "0.25rem",
      }}
      onDrop={handleDropEvent}
      onDragOver={(event) => {
        event.preventDefault();
      }}
    >
      <span style={{ color: "#5d2985" }}>drag & drop or browse a folder</span>
      <div></div>
    </div>
  );
};

export default Dropzone;
