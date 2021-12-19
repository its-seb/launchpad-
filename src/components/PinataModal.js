import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

class PinataModal extends Component {
  savePinataConfig = async () => {
    let pinataKey = document.getElementById("tbPinataKey").value;
    let pinataSecret = document.getElementById("tbPinataSecret").value;
    let authenticated = await this.checkPinataAuthentication(
      pinataKey,
      pinataSecret
    );

    if (authenticated) {
      localStorage.setItem("PINATA_KEY", pinataKey);
      localStorage.setItem("PINATA_SECRET", pinataSecret);
      alert("api saved successfully!");
      this.props.hideModal();
    } else {
      alert("invalid api key/secret, please verify");
    }
  };

  checkPinataAuthentication = async (pinataKey, pinataSecret) => {
    let response = await axios
      .get("https://api.pinata.cloud/data/testAuthentication", {
        headers: {
          pinata_api_key: pinataKey,
          pinata_secret_api_key: pinataSecret,
        },
      })
      .then((res) => {
        console.log("innerres", res.ok);
        return true;
      })
      .catch((e) => {
        console.log("error", e);
        return false;
      });
    return response;
  };

  render() {
    return (
      <>
        <div className="new-collection-modal">
          <span className="modal-title">Configure Pinata API</span>
          <Form.Floating
            className="mb-3 unselectable"
            style={{ marginTop: "15px" }}
          >
            <Form.Control
              id="tbPinataKey"
              type="text"
              placeholder="API Key"
              className="modal-form-control"
              defaultValue="295a526cef20b63d813c" //to remove
            />
            <label htmlFor="tbPinataKey" style={{ color: "#525252" }}>
              API Key
            </label>
          </Form.Floating>
          <Form.Floating
            className="mb-3 unselectable"
            style={{ marginTop: "15px" }}
          >
            <Form.Control
              id="tbPinataSecret"
              type="text"
              placeholder="API Secret"
              className="modal-form-control"
              defaultValue="f57c393914f6a30ac78b7a8641726a62c7285d12014adfe56e52686d5fdb03ff" //remember to remove
            />
            <label htmlFor="tbPinataSecret" style={{ color: "#525252" }}>
              API Secret
            </label>
          </Form.Floating>
          <Button
            id="btnSave"
            className="modal-form-submit"
            onClick={this.savePinataConfig}
            style={{ padding: "0.5rem", marginBottom: "3px" }}
          >
            Save
          </Button>
        </div>
      </>
    );
  }
}

export default PinataModal;
