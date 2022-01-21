import React, { Component } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import axios from "axios";
import Swal from "sweetalert2";
import "./global.css";

class PinataModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.tbPinataKey = React.createRef();
    this.tbPinataSecret = React.createRef();
  }
  savePinataConfig = async (e) => {
    e.preventDefault();

    let pinataKey = this.tbPinataKey.current.value;
    let pinataSecret = this.tbPinataSecret.current.value;
    let authenticated = await this.checkPinataAuthentication(
      pinataKey,
      pinataSecret
    );

    if (authenticated) {
      localStorage.setItem("PINATA_KEY", pinataKey);
      localStorage.setItem("PINATA_SECRET", pinataSecret);
      Swal.fire({
        title: "Success",
        icon: "success",
        text: "API has been configured",
      }); //do consider replacing this -boon
      this.props.hide();
    } else {
      Swal.fire({
        title: "Oops...",
        icon: "error",
        text: "API Key & Secret must be valid",
      }); //do consider replacing this -boon
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
      <Modal
        closeOnOverlayClick={false}
        isOpen={this.props.show}
        onClose={this.props.hide}
      >
        <ModalOverlay />
        <ModalContent bg="#2f3136" color="white" borderRadius={"xl"}>
          <ModalHeader borderBottom="1px solid #4c4c4c">
            Configure Pinata API
          </ModalHeader>
          <ModalBody pb={2} pt={2}>
            <FormControl>
              <FormLabel>Pinata API Key</FormLabel>
              <Input
                ref={this.tbPinataKey}
                focusBorderColor="#4c4c4c"
                borderColor="#4c4c4c"
                placeholder="API Key"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Pinata API Secret</FormLabel>
              <Input
                ref={this.tbPinataSecret}
                focusBorderColor="#4c4c4c"
                placeholder="API Secret"
                borderColor="#4c4c4c"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="modal_submit" onClick={this.savePinataConfig}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
}

export default PinataModal;
