import React, { Component } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import FailureComponent from "./FailureComponent.js";
import SuccessComponent from "./SuccessComponent.js";
import axios from "axios";
import "./global.css";

class PinataModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatusModal: false,
      statusTitle: "",
      statusText: "",
    };

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
      this.setState({ showStatusModal: true });
      this.setState({ statusTitle: "Success" });
      this.setState({ statusText: "API has been configured" });
      document.getElementById("statusSuccess").style.display = "block";
      this.props.hide();
    } else {
      this.setState({ showStatusModal: true });
      this.setState({ statusTitle: "Oops..." });
      this.setState({ statusText: "API Key & Secret must be valid" });
      document.getElementById("statusFailure").style.display = "block";
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

  closeStatusModal = () => {
    document.getElementById("statusSuccess").style.display = "none";
    document.getElementById("statusFailure").style.display = "none";
    this.setState({ showStatusModal: false });
  };

  render() {
    return (
      <>
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
        <Modal
          closeOnOverlayClick={false}
          isOpen={this.state.showStatusModal}
          onClose={this.closeStatusModal}
        >
          <ModalOverlay />
          <ModalContent bg="#2f3136" color="white" borderRadius={"xl"}>
            <ModalCloseButton top={4} />
            <ModalBody py={10} textAlign="center">
              <SuccessComponent id="statusSuccess" />
              <FailureComponent id="statusFailure" />
              <Text fontSize="1.8rem" fontWeight="600" pt="15px">
                {this.state.statusTitle}
              </Text>
              <Text fontSize="1rem" pt="5px">
                {this.state.statusText}
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }
}

export default PinataModal;
