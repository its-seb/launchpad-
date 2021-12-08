import React, { Component } from "react";
import { fetchContractContent } from "../scripts/fetchContractContent.js";
import { eventHandler } from "../scripts/eventHandler.js";
import { getWalletAddress } from "../scripts/getWalletAddress.js";
import IconService from "icon-sdk-js";

const {
  IconAmount,
  IconConverter,
  HttpProvider,
  IconWallet,
  IconBuilder,
  SignedTransaction,
} = IconService;

const { DeployTransactionBuilder } = IconService.IconBuilder;

window.addEventListener("ICONEX_RELAY_RESPONSE", eventHandler, false);

class Testconnection extends Component {
  constructor(props) {
    super(props);

    //HttpProvider is used to communicate with http
    this.provider = new HttpProvider("https://ctz.solidwallet.io/api/v3");

    //Create IconService instance
    this.iconService = new IconService(this.provider);

    //Constants
    this.content = "";
    this.walletAddress = "";
    // console.log(ICONexResponse);
    //console.log("wallet", ICONexResponse.walletAddress);
  }

  handleFormSubmission = (event) => {
    const contractContent = fetchContractContent(
      "https://raw.githubusercontent.com/OpenDevICON/token-score-factory/master/zips/owner_burnable_irc3.zip"
    );
    this.walletAddress = document.getElementById("response-address").value;
    const tokenName = document.getElementById("tokenName").value;
    const tokenSymbol = document.getElementById("tokenSymbol").value;
    const initialSupply = IconConverter.toBigNumber(
      document.getElementById("tokenInitialSupply").value
    );
    const decimals = IconConverter.toBigNumber("18");

    const txParams = {
      _name: tokenName,
      _symbol: tokenSymbol,
      _initialSupply: IconConverter.toHex(initialSupply),
      _decimals: IconConverter.toHex(decimals),
    };

    const txObject = new DeployTransactionBuilder()
      .from(this.walletAddress)
      .to("cx0000000000000000000000000000000000000000")
      .stepLimit(IconConverter.toBigNumber(2500000))
      .nid(IconConverter.toBigNumber(3))
      .nonce(IconConverter.toBigNumber(1))
      .version(IconConverter.toBigNumber(3))
      .timestamp(1544596599371000)
      .contentType("application/zip")
      .content(contractContent)
      .params(txParams)
      .build();

    console.log(txObject);
    event.preventDefault();
  };

  handleWalletConnection = (event) => {
    window.dispatchEvent(
      new CustomEvent("ICONEX_RELAY_REQUEST", {
        detail: {
          type: "REQUEST_ADDRESS",
        },
      })
    );
    console.log(getWalletAddress());
    event.preventDefault();
  };

  updateWalletAddress = (event) => {
    this.walletAddress = document.getElementById("response-address").value;
    //console.log("ICONexResponse", ICONexResponse.walletAddress);
    //console.log("ICONexObject", ICONexResponse);
    console.log(this.walletAddress);
  };

  render() {
    return (
      <div>
        <button type="submit" onClick={this.handleWalletConnection}>
          Connect Wallet
        </button>
        <input
          type="text"
          id="response-address"
          placeholder="selected address"
          style={{ width: "100%" }}
        ></input>
      </div>
    );
  }
}

export default Testconnection;
