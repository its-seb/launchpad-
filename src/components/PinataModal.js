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
  Box,
  CloseButton,
  Spinner,
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
      hide: this.props.hide,
    };

    this.tbPinataKey = React.createRef();
    this.tbPinataSecret = React.createRef();
    this.statusModal = React.createRef();
    this.statusSuccess = React.createRef();
    this.statusFail = React.createRef();
    this.statusLoading = React.createRef();
  }
  savePinataConfig = async (e) => {
    e.preventDefault();

    this.statusModal.current.style.zIndex = "1000000";
    this.statusModal.current.style.display = "block";
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

      this.statusLoading.current.style.display = "none";
      this.statusSuccess.current.style.display = "block";

      //document.getElementById("statusSuccess").style.display = "block";
      this.props.hide();
    } else {
      this.setState({ showStatusModal: true });
      this.setState({ statusTitle: "Oops..." });
      this.setState({ statusText: "API Key & Secret must be valid" });

      this.statusLoading.current.style.display = "none";
      this.statusFail.current.style.display = "block";
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
    this.setState({ showStatusModal: false });
    this.statusSuccess.current.style.display = "none";
    this.statusFail.current.style.display = "none";
    this.statusModal.current.style.display = "none";
    this.statusLoading.current.style.display = "block";
    this.setState({ statusTitle: "" });
    this.setState({ statusText: "" });
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
                  defaultValue="27a26cd9694149aa15a0"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Pinata API Secret</FormLabel>
                <Input
                  ref={this.tbPinataSecret}
                  focusBorderColor="#4c4c4c"
                  placeholder="API Secret"
                  borderColor="#4c4c4c"
                  defaultValue="9f405490db4a07e109492baadb518328dfdb1ae91f67824de531c9054b8a670a"
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

        <Box
          id="statusModal"
          layerStyle="modal_container"
          ref={this.statusModal}
        >
          <Box layerStyle="modal_content" alignItems="center">
            <CloseButton
              position="absolute"
              right={3}
              top={3}
              onClick={this.closeStatusModal}
            />
            <Spinner
              variant="loading_spinner"
              thickness="4px"
              speed="0.65s"
              ref={this.statusLoading}
            ></Spinner>
            <SuccessComponent _ref={this.statusSuccess} _show="none" />
            <FailureComponent _ref={this.statusFail} _show="none" />

            <Text layerStyle="modal_title">{this.state.statusTitle}</Text>
            <Text layerStyle="modal_text">{this.state.statusText}</Text>
          </Box>
        </Box>
      </>
    );
  }
}

export default PinataModal;
