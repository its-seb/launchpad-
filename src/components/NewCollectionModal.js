import React, { Component } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import IconService from "icon-sdk-js";
import Dexie from "dexie";
import { XIcon } from "@heroicons/react/solid";
import FailureComponent from "./FailureComponent.js";
import SuccessComponent from "./SuccessComponent.js";
import { fetchContractContent } from "./utils/fetchContractContent.js";
import ICONexConnection, {
  estimateStepsforDeployment,
  sleep,
} from "./utils/interact.js";
import "./style.css";
import cfg from "../config.json";
const { IconConverter, IconBuilder, HttpProvider } = IconService;
class NewCollectionModal extends Component {
  constructor(props) {
    super(props);
    this.db = new Dexie("contracts_deployed");
    this.db.version(1).stores({
      contracts: "contractAddress, walletAddress, name, symbol",
    });
    this.db.open().catch((error) => {
      console.log("error", error);
    });
  }

  connection = new ICONexConnection();

  handleDeployContract = async () => {
    //checks before proceeding for deployment
    const walletAddress = localStorage.getItem("USER_WALLET_ADDRESS");
    const collectionName = document.getElementById("tbCollectionName").value;
    const collectionSymbol =
      document.getElementById("tbCollectionSymbol").value;

    if (walletAddress == null) {
      alert("Please connect your wallet.");
      return;
    } else if (!collectionName.length || !collectionSymbol.length) {
      //remember to sanitize input-> allow alphanumeric only
      alert("Please enter required fields");
      return;
    }

    const contractContent = await fetchContractContent(
      "https://gateway.pinata.cloud/ipfs/QmT54kDzsjig5DTwwpRfm72ehCawBiUYuj7GfyJp3R8fyS"
    );

    let collectionContainer = document.getElementById(
      "new-collection-container"
    );
    let loadingContainer = document.getElementById("loading-container");
    let deploymentLoading = document.getElementById("deploymentLoading");
    let deploymentSuccess = document.getElementById("deploymentSuccess");
    let deploymentFailure = document.getElementById("deploymentFailure");
    let deploymentStatusText = document.getElementById("deployText");

    deploymentStatusText.innerText = "deploying collection...";
    deploymentStatusText.style.display = "block";
    collectionContainer.style.display = "none";
    deploymentLoading.style.display = "block";
    loadingContainer.style.display = "block";

    const txParams = {
      _name: collectionName, //based on user input
      _symbol: collectionSymbol, //based on user input
    };
    const stepLimitInHex = await estimateStepsforDeployment(
      walletAddress,
      contractContent,
      txParams
    );

    console.log("steplimitinhex", stepLimitInHex);

    const stepLimit = IconConverter.toNumber(stepLimitInHex);
    const txObj = new IconBuilder.DeployTransactionBuilder()
      .nid("0x53") //0x53 for sejong - https://www.icondev.io/introduction/the-icon-network/testnet
      .from(walletAddress)
      .to(cfg.ZERO_ADDRESS) //constant
      .stepLimit(IconConverter.toBigNumber(stepLimit))
      .version(IconConverter.toBigNumber(3)) //constant
      .timestamp(Date.now() * 1000) //constant
      .contentType("application/zip") //.py score
      .content(contractContent)
      .nonce(IconConverter.toBigNumber(1))
      .params(txParams)
      .build();

    //console.log(txObj);
    const payload = {
      jsonrpc: "2.0",
      method: "icx_sendTransaction",
      id: 6639,
      params: IconConverter.toRawTransaction(txObj),
    };

    try {
      let rpcResponse = await this.connection.getJsonRpc(payload);
      const txHash = rpcResponse.result;
      console.log("txHash", txHash);

      const provider = new HttpProvider(
        "https://sejong.net.solidwallet.io/api/v3"
      );
      const iconService = new IconService(provider);
      await sleep(5000);
      const txObject = await iconService.getTransactionResult(txHash).execute();
      console.log("txObject", txObject);
      //update indexedDB
      this.db.contracts
        .add({
          contractAddress: txObject.scoreAddress,
          walletAddress: walletAddress,
          name: collectionName,
          symbol: collectionSymbol,
          metahash_exist: 0,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
      this.props.updateContractInfo(walletAddress);

      deploymentLoading.style.display = "none";
      deploymentSuccess.style.display = "block";
      deploymentStatusText.innerText = "new collection has been created";
      await sleep(2000);
      deploymentSuccess.style.display = "none";
      deploymentStatusText.style.display = "none";
      collectionContainer.style.display = "block";
      this.props.hideModal();
    } catch (e) {
      //alert("User cancelled transaction");
      deploymentLoading.style.display = "none";
      deploymentFailure.style.display = "block";
      deploymentStatusText.innerText = "deployment cancelled by user";
      await sleep(2000);
      deploymentStatusText.style.display = "none";
      deploymentFailure.style.display = "none";
      collectionContainer.style.display = "block";

      console.log(e); //handle error here (e.g. user cancelled transaction; show message)
    }
  };

  render() {
    return (
      <>
        <div id="new-collection-modal" className="new-collection-modal">
          <div id="new-collection-container">
            <span className="modal-title">New Collection</span>
            <XIcon className="close-modal" onClick={this.props.hideModal} />
            <Form.Floating
              className="mb-3 unselectable"
              style={{ marginTop: "15px" }}
            >
              <Form.Control
                id="tbCollectionName"
                type="text"
                placeholder="Collection Name"
                className="modal-form-control"
              />
              <label htmlFor="tbCollectionName" style={{ color: "#525252" }}>
                Collection Name
              </label>
            </Form.Floating>
            <Form.Floating className="mb-3 unselectable">
              <Form.Control
                id="tbCollectionSymbol"
                type="text"
                placeholder="Symbol"
                className="modal-form-control"
              />
              <label htmlFor="tbCollectionSymbol" style={{ color: "#525252" }}>
                Symbol
              </label>
            </Form.Floating>

            <Button
              id="btnDeploy"
              className="modal-form-submit"
              onClick={this.handleDeployContract}
              style={{ padding: "0.5rem", marginBottom: "3px" }}
            >
              deploy
            </Button>
          </div>

          <div id="loading-container">
            <Spinner animation="border" id="deploymentLoading"></Spinner>
            <SuccessComponent id="deploymentSuccess" />
            <FailureComponent id="deploymentFailure" />
            <span id="deployText">deploying collection...</span>
          </div>
        </div>
      </>
    );
  }
}

export default NewCollectionModal;
