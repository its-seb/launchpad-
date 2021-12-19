import React, { Component } from "react";
import IconService from "icon-sdk-js";
import ICONexConnection from "./utils/interact.js";

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

    let search = window.location.search;
    let params = new URLSearchParams(search);
    this.contract_address = params.get("contract");
    this.dragORfiles(this.contract_address);


  }
  connection = new ICONexConnection;
  async dragORfiles(contractAddress) {
    //check if its deployed by launchpad
    const txObj = new IconService.IconBuilder.CallTransactionBuilder()
      .from(localStorage.getItem("USER_WALLET_ADDRESS"))
      .to(contractAddress)
      .stepLimit(IconService.IconConverter.toBigNumber("2000000"))
      .nid("0x53")
      .nonce(IconService.IconConverter.toBigNumber("1"))
      .version(IconService.IconConverter.toBigNumber("3"))
      .timestamp(new Date().getTime() * 1000)
      .method("setMetahash")
      .params({ _metahash: "blablabla" })
      .build();

    const payload = {
      jsonrpc: "2.0",
      method: "icx_sendTransaction",
      id: 6639,
      params: IconService.IconConverter.toRawTransaction(txObj),
    };

    let x = await this.connection.ICONexRequest("REQUEST_JSON-RPC", payload)
    console.log("Setmetahash", x)
    // let rpcResponse = await this.connection.getJsonRpc(payload);
    // console.log("rpc",rpcResponse)

    // const txObj2 = new IconService.IconBuilder.CallBuilder()
    //   .to(contractAddress)
    //   .method("getMetahash")
    //   .build();

    // let result2 = await this.iconService
    //   .call(txObj2)
    //   .execute()
    //   .then((response) => {
    //     console.log("success");
    //     return response;
    //   })
    //   .catch((error) => {
    //     Promise.resolve({ error });
    //     //console.log(error);
    //     return "0x0";
    //   });

    // console.log(result2);
  }

  componentDidMount() {
    console.log(this.contract_address)
    document.getElementById("_pageTitle").innerText = this.props.pageTitle;

  }

  render() {
    return <div>file component</div>;
  }
}

export default FileComponent;
