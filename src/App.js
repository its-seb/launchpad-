import React, { Component } from "react";
import "./App.css";
import AppContent from "./components/AppContent.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/Navigation.js";
import SideNav from "./components/SideNav.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CollectionComponent from "./components/CollectionComponent.js";
import FileComponent from "./components/FileComponent.js";
import LaunchComponent from "./components/LaunchComponent.js";
import { Button } from "react-bootstrap";
import ICONexConnection from "./components/utils/interact.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.walletAddress = "";
  }

  connection = new ICONexConnection();

  handleWalletEvent = async (event) => {
    this.walletAddress = await this.connection.getWalletAddress();
    if (this.walletAddress == "undefined" || this.walletAddress == null) {
      document.getElementById("btnConnectWallet").innerHTML = "connect wallet";
    } else {
      document.getElementById(
        "btnConnectWallet"
      ).innerHTML = `connected to ${this.walletAddress}`;
      localStorage.setItem("USER_WALLET_ADDRESS", this.walletAddress);
    }
    event.preventDefault();
  };

  render() {
    return (
      <div className="App" style={{ backgroundColor: "#F2F2F2" }}>
        <Router>
          <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <SideNav />

            <div className="pageContent">
              <div className="headerContent">
                <text className="pageTitle" id="_pageTitle"></text>
                <Button id="btnConnectWallet" onClick={this.handleWalletEvent}>
                  connect wallet
                </Button>
              </div>
              <div className="mainContent">
                <Routes>
                  <Route
                    exact
                    element={<CollectionComponent pageTitle="Collection" />}
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
        </Router>
      </div>
    );
  }
}

export default App;
