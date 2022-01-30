import React, { Component } from "react";
import IconService from "icon-sdk-js";
import ICONexConnection from "./utils/interact.js";
import PinataModal from "./PinataModal.js";
import Dexie from "dexie";
import "./style.css";
import Dropzone from "./Dropzone.js";
import Gallery from "./Gallery.js";
import { Navigate } from "react-router-dom";

import { Box, Stack, Link } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Link as RouteLink,
} from "react-router-dom";
export class FileComponent extends Component {
  // 1. Get the collection hash address
  // 2. call builder to the hash address
  // 3. Get metahash of the folder that contains all the metadata of file uploaded in this collection
  // 4. Transfer to file page

  //4. If metahash exist, proceed to pull all file out
  // 5. If metahash does not exist, proceed to show interface for drag and drop
  constructor(props) {
    super(props);

    this.state = {
      showPinataModal: false,
      pinataKey: null,
      pinataSecret: null,
      hasMetahash: localStorage.getItem("HAS_METAHASH"),
      walletAddress: null,
      contractAddress: null,
      redirect: false,
    };

    const provider = new IconService.HttpProvider(
      "https://sejong.net.solidwallet.io/api/v3"
    );
    this.contract_metahash = "";
    this.iconService = new IconService(provider);

    this.db = new Dexie("contracts_deployed");
    this.db.version(1).stores({
      contracts: "contractAddress, walletAddress, name, symbol, metahash_exist",
    });
    this.db.open().catch((error) => {
      console.log("error", error);
    });
  }
  connection = new ICONexConnection();

  async dragORfiles(contractAddress) {}

  async componentDidMount() {
    //document.getElementById("_pageTitle").innerText = this.props.pageTitle;
    if (
      this.state.walletAddress == null &&
      localStorage.getItem("USER_WALLET_ADDRESS")
    ) {
      alert("Please connect your wallet.");
      return;
    }
    if (
      this.state.contractAddress == null &&
      localStorage.getItem("SELECTED_CONTRACT_ADDRESS") == null
    ) {
      alert("you need to select a contract to view files");
      return;
    }

    //check if user has configured pinata cloud api
    this.state.pinataKey = localStorage.getItem("PINATA_KEY");
    this.state.pinataSecret = localStorage.getItem("PINATA_SECRET");
    this.state.walletAddress = localStorage.getItem("USER_WALLET_ADDRESS");
    this.state.contractAddress = localStorage.getItem(
      "SELECTED_CONTRACT_ADDRESS"
    );

    // if (this.state.pinataKey == null || this.state.pinataSecret == null) {
    //   this.showPinataModal(); //configure to continue
    // }

    console.log("filecomponent", this.state.hasMetahash);
  }

  componentWillReceiveProps() {
    console.log("receiving", this.state);
    const walletAddress = localStorage.getItem("USER_WALLET_ADDRESS");
    const contractAddress = localStorage.getItem("SELECTED_CONTRACT_ADDRESS");
    if (walletAddress == null) {
      this.setState({ walletAddress: null });
      return <Navigate to="/launch" />;
    }
    if (contractAddress == null || this.state.contractAddress == null) {
      console.log("receive props", contractAddress, this.state.contractAddress);
      this.setState({ contractAddress: null });
    }
  }

  showPinataModal = () => {
    this.setState({ showPinataModal: true });
  };

  hidePinataModal = () => {
    if (
      localStorage.getItem("PINATA_KEY") != null &&
      localStorage.getItem("PINATA_SECRET") != null
    ) {
      this.setState({ showPinataModal: false });
    }
  };

  render() {
    return (
      <>
        <Stack flexDirection="row">
          <Box mt="1rem">
            <Link as={RouteLink} variant="notCurrent" to="/collection">
              Collection
            </Link>
            <Link variant="current" href="/file">
              File
            </Link>
            <Link variant="notCurrent" href="/launch">
              Launch
            </Link>
          </Box>
        </Stack>

        {this.state.hasMetahash == "true" ? (
          <Gallery metahash={this.contract_metahash} />
        ) : (
          <Dropzone />
        )}
        <PinataModal
          show={this.state.showPinataModal}
          hide={this.hidePinataModal}
        ></PinataModal>
      </>
    );
  }
}

export default FileComponent;
