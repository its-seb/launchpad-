import React from "react";
import { Button, Form } from "react-bootstrap";
import "./global.css";
import IconService from "icon-sdk-js";

const { IconConverter, IconBuilder } = IconService;
const PinataSetting = (props) => {
  //modal things
  const [showPinataModal, setShowPinataModal] = props.modalProps;
  //  const [authenticated, setAuthentication] = setState;

  const handleSavePinata = async () => {
    const pinataKey = document.getElementById("tbPinataKey").value;
    const pinataSecret = document.getElementById("tbPinataSecret").value;
    let authenticated = await checkPinataAuthentication(
      pinataKey,
      pinataSecret
    );
    if (authenticated) {
      localStorage.setItem("PINATA_KEY", pinataKey);
      localStorage.setItem("PINATA_SECRET", pinataSecret);
      alert("api saved successfully!");
    } else {
      alert("invalid api key/secret, please verify");
    }
  };

  const checkPinataAuthentication = async (pinataKey, pinataSecret) => {
    try {
      const isAuthenticated = await fetch(
        "https://api.pinata.cloud/data/testAuthentication",
        {
          method: "GET",
          headers: {
            pinata_api_key: pinataKey,
            pinata_secret_api_key: pinataSecret,
          },
        }
      ).then((response) => {
        return response.ok;
      });
      return isAuthenticated;
    } catch (error) {
      console.error("FETCH:", error);
      console.log("catch block", error);
      throw error;
    }
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
          defaultValue="295a526cef20b63d813c" //to remove
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
          defaultValue="f57c393914f6a30ac78b7a8641726a62c7285d12014adfe56e52686d5fdb03ff" //remember to remove
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
