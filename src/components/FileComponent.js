import React, { Component } from "react";
import { Button } from "react-bootstrap";
import IconService from "icon-sdk-js";
import ICONexConnection from "./utils/interact.js";
const { IconConverter, IconBuilder, HttpProvider } = IconService;

export class FileComponent extends Component {
  // 1. Get the collection hash address
  // 2. call builder to the hash address
  // 3. Get metahash of the folder that contains all the metadata of file uploaded in this collection
  // 4. Transfer to file page

  //4. If metahash exist, proceed to pull all file out
  // 5. If metahash does not exist, proceed to show interface for drag and drop
  constructor(props) {
    super(props);
    const provider = new IconService.HttpProvider(
      "https://sejong.net.solidwallet.io/api/v3"
    );
    this.iconService = new IconService(provider);
    this.contractAddress = localStorage.getItem("SELECTED_CONTRACT_ADDRESS");
    this.walletAddress = localStorage.getItem("USER_WALLET_ADDRESS");
  }
  connection = new ICONexConnection();
  async dragORfiles(contractAddress) {}

  componentDidMount() {
    console.log("componentdidMount", this.contractAddress);
    if (this.contractAddress == null) {
      alert("you need to select a contract to view files");
    }
  }

  updateMetahash = async () => {
    const txObj = new IconBuilder.CallTransactionBuilder()
      .from(this.walletAddress)
      .to(this.contractAddress)
      .stepLimit(IconConverter.toBigNumber(2000000))
      .nid("0x53")
      .nonce(IconConverter.toBigNumber(1))
      .version(IconConverter.toBigNumber(3)) //constant
      .timestamp(new Date().getTime() * 1000)
      .method("setMetahash")
      .params({ _metahash: "helloworld" })
      .build();
    console.log("txobj", txObj);
    const payload = {
      jsonrpc: "2.0",
      method: "icx_sendTransaction",
      id: 6639,
      params: IconConverter.toRawTransaction(txObj),
    };
    console.log("payload", payload);
    let rpcResponse = await this.connection.getJsonRpc(payload);
    console.log("rpcresponse", rpcResponse);
  };

  getMetahash = async () => {
    const callObj = new IconBuilder.CallBuilder()
      .from(null)
      .to(this.contractAddress)
      .method("getMetahash")
      .build();

    let result = await this.iconService
      .call(callObj)
      .execute()
      .then((response) => {
        console.log("success_getmetahash", response);
      })
      .catch((error) => {
        console.log("getmetahash", error);
        Promise.resolve({ error });
      });
  };

  render() {
    return (
      <div>
        file component
        <Button onClick={this.updateMetahash}>updateMetahash</Button>
        <Button onClick={this.getMetahash}>getMetahash</Button>
      </div>
    );
  }
}

export default FileComponent;
