import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import IconService from "icon-sdk-js";
import Dexie from "dexie";
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
    const walletAddress = localStorage.getItem("USER_WALLET_ADDRESS");
    if (walletAddress == null) {
      alert("Please connect to your wallet.");
      return;
    }

    const contractContent = await fetchContractContent(
      "https://gateway.pinata.cloud/ipfs/QmfB31n3VLPwaQnGJNJgsTrGKbrsYzfaFJznRxDvyLgP2e"
    );

    console.log(walletAddress);
    //remember to sanitize input-> allow alphanumeric only
    const collectionName = document.getElementById("tbCollectionName").value;
    const collectionSymbol =
      document.getElementById("tbCollectionSymbol").value;

    if (!collectionName.length || !collectionSymbol.length) {
      alert("Please enter required fields");
      return;
    }

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
        })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });

      alert("Deployed successfully!");
      this.props.updateContractInfo(walletAddress);
    } catch (e) {
      //alert("User cancelled transaction");
      console.log(e); //handle error here (e.g. user cancelled transaction; show message)
    }
  };

  render() {
    return (
      <>
        <div className="new-collection-modal">
          <span className="modal-title">New Collection</span>
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
      </>
    );
  }
}

export default NewCollectionModal;
