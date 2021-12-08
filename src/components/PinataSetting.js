import React from "react";
import { Button, Form } from "react-bootstrap";
import "./global.css";
import IconService from "icon-sdk-js";

const { IconConverter, IconBuilder } = IconService;
const PinataSetting = (props) => {
  //modal things
  const [showPinataModal, setShowPinataModal] = props.modalProps;

  const handleSavePinata = () => {
    const PINATA_KEY = document.getElementById("tbPinataKey").value;
    const PINATA_SECRET = document.getElementById("tbPinataKey").value;
    localStorage.setItem("PINATA_KEY", PINATA_KEY);
    localStorage.setItem("PINATA_SECRET", PINATA_SECRET);

    //check if pinata api is valid
  };
  return (
    <div style={{ padding: "25px 25px" }}>
      <span
        style={{
          fontSize: "larger",
          fontWeight: "bold",
          color: "#525252",
        }}
      >
        Configure Pinata API
      </span>
      <Form.Floating className="mb-3" style={{ marginTop: "15px" }}>
        <Form.Control
          id="tbPinataKey"
          type="text"
          placeholder="API Key"
          className="purpleTextbox"
        />
        <label htmlFor="tbPinataKey" style={{ color: "#525252" }}>
          API Key
        </label>
      </Form.Floating>
      <Form.Floating>
        <Form.Control
          id="tbPinataSecret"
          type="text"
          placeholder="API Secret"
          className="purpleTextbox"
        />
        <label htmlFor="tbPinataSecret" style={{ color: "#525252" }}>
          API Secret
        </label>
      </Form.Floating>
      <Button
        id="btnSavePinata"
        style={{ marginTop: "15px", float: "right" }}
        onClick={handleSavePinata}
      >
        Save
      </Button>
    </div>
  );
};

export default PinataSetting;
