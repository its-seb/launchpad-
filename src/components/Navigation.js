import React from "react";
import { Navbar, Container } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import logo from "../assets/launchpad_logo.png";
import NavigationStyle from "./Navigation.module.css";
import ICONexConnection from "./utils/interact.js";

const Navigation = () => {
  let walletAddress;
  const connection = new ICONexConnection();
  const handleWalletClickEvent = async () => {
    walletAddress = await connection.getWalletAddress();
    const connectionButton = document.getElementById("selectWallet");

    if (walletAddress == "undefined" || walletAddress == null) {
      connectionButton.innerHTML = "Connect Wallet";
    } else {
      connectionButton.innerHTML = `Connected to ${walletAddress}`;
      localStorage.setItem("USER_WALLET_ADDRESS", walletAddress);
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        style={{
          padding: "10px 25px 10px 25px",
          borderBottom: "1px solid rgba(0,0,0,.125)",
        }}
      >
        <Container style={{ height: "70px" }}>
          <Navbar.Brand href="#">
            <Image src={logo} style={{ width: "200px" }}></Image>
          </Navbar.Brand>
          <Button
            id="selectWallet"
            className={NavigationStyle.btnWallet}
            onClick={handleWalletClickEvent}
          >
            Connect Wallet
          </Button>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
