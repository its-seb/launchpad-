import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/style.css";
import SideNav from "./components/SideNav.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dexie from "dexie";
import CollectionComponent from "./components/CollectionComponent.js";
import FileComponent from "./components/FileComponent.js";
import LaunchComponent from "./components/LaunchComponent.js";
import Usergallery from "./components/Usergallery";
import { Button } from "react-bootstrap";
import ICONexConnection from "./components/utils/interact.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.db = new Dexie("contracts_deployed");
    this.db.version(1).stores({
      contracts: "contractAddress, walletAddress, name, symbol",
    });
    this.db.open().catch((error) => {
      console.log("error", error);
    });
    this.state = {
      walletAddress: null,
      user_contract_address: null,
      user_walletaddress: null,
    };
  }

  connection = new ICONexConnection();
  componentDidMount() {
    if (localStorage.getItem("USER_WALLET_ADDRESS") != null) {
      document.getElementById("btnConnectWallet").innerHTML = "sign out";
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.setState({ user_contract_address: urlParams.get('collection') });
    this.setState({ user_walletaddress: urlParams.get('walletaddress') });
  }

  handleWalletEvent = async (event) => {
    if (localStorage.getItem("USER_WALLET_ADDRESS") == null) {
      //signing in
      let _walletAddress = await this.connection.getWalletAddress();
      if (_walletAddress != null) {
        localStorage.setItem("USER_WALLET_ADDRESS", _walletAddress);
        console.log(localStorage.getItem("USER_WALLET_ADDRESS"));
        document.getElementById("btnConnectWallet").innerHTML = "sign out";
        this.setState({ walletAddress: _walletAddress });
      } else {
        console.log("user cancelled login");
      }
    } else {
      //signing out
      localStorage.removeItem("USER_WALLET_ADDRESS");
      localStorage.removeItem("SELECTED_CONTRACT_ADDRESS");
      document.getElementById("btnConnectWallet").innerHTML = "connect wallet";
      this.setState({ walletAddress: null });
    }

    // console.log(localStorage.getItem("USER_WALLET_ADDRESS"));
    // if (
    //   document.getElementById("btnConnectWallet").innerHTML == "connect wallet"
    // ) {
    //   this.walletAddress = await this.connection.getWalletAddress();
    //   if (this.walletAddress != "undefined" && this.walletAddress != null) {
    //     localStorage.setItem("USER_WALLET_ADDRESS", this.walletAddress);
    //     document.getElementById("btnConnectWallet").innerHTML = "sign out";
    //     this.db.contracts.clear();
    //     this.db.close();
    //   }
    // } else {
    //   localStorage.removeItem("USER_WALLET_ADDRESS");
    //   document.getElementById("btnConnectWallet").innerHTML = "connect wallet";
    // }
    event.preventDefault();
  };

  render() {
    return (
      <div style={{ backgroundColor: "#F2F2F2", height: "100vh" }}>
        {this.state.user_contract_address != null && this.state.user_walletaddress != null ? (
          <Router>
            <Routes>
              <Route
                exact
                element={<Usergallery pageTitle="Usergallery" />}
                path="/Usergallery"
              ></Route>
            </Routes>
          </Router>) : (

          <div className="App">
            <Router>
              <div style={{ display: "flex", width: "100%", height: "100%" }}>
                <SideNav />
                <div className="pageContent">
                  <div className="headerContent">
                    <text className="pageTitle unselectable" id="_pageTitle"></text>
                    <Button id="btnConnectWallet" onClick={this.handleWalletEvent}>
                      connect wallet
                    </Button>
                  </div>
                  <div className="mainContent">
                    <Routes>
                      <Route
                        exact
                        element={
                          <CollectionComponent
                            pageTitle="Collection"
                            walletAddress={this.state.walletAddress}
                          />
                        }
                        path="/"
                      ></Route>
                      <Route
                        exact
                        element={<FileComponent pageTitle="Files" />}
                        path="/files"
                      ></Route>
                      <Route
                        exact
                        element={<LaunchComponent pageTitle="Launch" />}
                        path="/launch"
                      ></Route>
                    </Routes>
                  </div>
                </div>
              </div>
            </Router></div>)}
      </div>
    );
  }
}

export default App;
