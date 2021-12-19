import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./global.css";
import IconService from "icon-sdk-js";
import { fetchContractContent } from "./utils/fetchContractContent.js";
import ICONexConnection, {
  estimateStepsforDeployment,
} from "./utils/interact.js";
import Dexie from "dexie";
import cfg from "../config.json";
import axios from "axios";

const { IconConverter, IconBuilder, HttpProvider } = IconService;

const NewCollection = (props) => {
  //modal things
  //const [showCollectionModal, setShowCollectionModal] = props.modalProps;
  //const [contractInfoLength, setContractInfoLen] = props.usertxFunc;

  //contract
  const connection = new ICONexConnection();
  var db = new Dexie("contracts_deployed");
  db.version(1).stores({
    contracts: "contractAddress, walletAddress, name, symbol",
  });
  db.open().catch((error) => {
    console.log("error", error);
  });
  const handleDeployContract = async () => {
    //check if user address is set:
    if (localStorage.getItem("USER_WALLET_ADDRESS") == null) {
      alert("Please connect to your wallet.");
      return;
    }

    const contractContent = await fetchContractContent(
      "https://gateway.pinata.cloud/ipfs/QmRJP6mcfSr9a8ZEcKgfPVf8ACSxVLtSXsSoF89eQbuYG1"
    );
    //    console.log(contractContent);
    const walletAddress = cfg.LOCAL_WALLET_ADDRESS; //localStorage.getItem("USER_WALLET_ADDRESS");

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
      let rpcResponse = await connection.getJsonRpc(payload);
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
      db.contracts
        .add({
          contractAddress: txObject.scoreAddress,
          walletAddress: cfg.LOCAL_WALLET_ADDRESS,
          name: collectionName,
          symbol: collectionSymbol,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });

      //setShowCollectionModal(false);
      alert("Deployed successfully!");

      //setContractInfoLen(setContractInfoLen + 1);
    } catch (e) {
      //alert("User cancelled transaction");
      console.log(e); //handle error here (e.g. user cancelled transaction; show message)
    }
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const getContractAddress = async (txHash) => {
    let response = await axios
      .get(
        `https://sejong.tracker.solidwallet.io/v3/transaction/txDetail?txHash=${txHash}`
      )
      .then((res) => {
        console.log("res", res);
        console.log("res.data", res.data);
        return res.data;
      });
    return response.data.targetContractAddr;
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
        New Collection
      </span>
      <Form.Floating className="mb-3" style={{ marginTop: "15px" }}>
        <Form.Control
          id="tbCollectionName"
          type="text"
          placeholder="Collection Name"
          className="purpleTextbox"
        />
        <label htmlFor="tbCollectionName" style={{ color: "#525252" }}>
          Collection Name
        </label>
      </Form.Floating>
      <Form.Floating>
        <Form.Control
          id="tbCollectionSymbol"
          type="text"
          placeholder="Symbol"
          className="purpleTextbox"
        />
        <label htmlFor="tbCollectionSymbol" style={{ color: "#525252" }}>
          Symbol
        </label>
      </Form.Floating>
      <Button
        id="btnDeploy"
        onClick={handleDeployContract}
        style={{ marginTop: "15px", float: "right" }}
      >
        Deploy
      </Button>
    </div>
  );
};

export default NewCollection;
