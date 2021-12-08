import React, { Component } from "react";
import ICONexConnection, {
  estimateStepsforDeployment,
} from "./utils/interact.js";
import { fetchContractContent } from "./utils/fetchContractContent.js";
import IconService from "icon-sdk-js";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import AppContentStyle from "./AppContent.module.css";
const { IconConverter, IconBuilder } = IconService;

const AppContent = (props) => {
  const connection = new ICONexConnection();

  const handleDeployContract = async () => {
    const contractContent = await fetchContractContent(
      "https://raw.githubusercontent.com/OpenDevICON/token-score-factory/master/zips/owner_burnable_irc3.zip"
    );
    console.log(contractContent);
    const walletAddress = "hxbd1375315c7732779edaa4c3903ffc9b93e82ca3"; //localStorage.getItem("USER_WALLET_ADDRESS");
    const txParams = {
      _name: "BILLY",
      _symbol: "BILL",
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
      .to("cx0000000000000000000000000000000000000000")
      .stepLimit(IconConverter.toBigNumber(stepLimit))
      .version(IconConverter.toBigNumber(3))
      .timestamp(Date.now() * 1000)
      .contentType("application/zip")
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
      console.log(rpcResponse);
      localStorage.setItem("CONTRACT_ADDRESS", rpcResponse["result"]);
    } catch (e) {
      console.log(e); //handle error here (e.g. user cancelled transaction; show message)
    }
  };

  return (
    <div style={{ height: "calc(100vh - 91px)" }}>
      <Container style={{ padding: "25px" }}>
        <div className={AppContentStyle.sectionHeader}>
          <span style={{ float: "left" }}>Collections</span>{" "}
          <button className={AppContentStyle.btnAddContract}>
            + Create Collection
          </button>
        </div>
        <div style={{ padding: "0 25px" }}>
          <Row>
            <Col>
              <Card>
                <div style={{ display: "inline" }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      color: "#525252",
                    }}
                  >
                    Billy
                  </span>
                  <span style={{ verticalAling: "sub" }}>BILL</span>
                </div>
                <span>$BILL</span>
                <span>View Collection</span>
                <span>Icon Tracker</span>
              </Card>
            </Col>
            <Col>
              <Card>Hello</Card>
            </Col>
            <Col>
              <Card>Hello</Card>
            </Col>
          </Row>
        </div>
      </Container>
      <button id="deployContract" onClick={handleDeployContract}>
        hello world
      </button>
    </div>
  );
};

export default AppContent;
