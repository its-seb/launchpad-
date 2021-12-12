import "./app_content.css";
import React, { useState, useEffect, useReducer } from "react";
import { Container, Button, Row, Col, Card, Modal } from "react-bootstrap";
import AppContentStyle from "./AppContent.module.css";
import NewCollection from "./NewCollection.js";
import PinataSetting from "./PinataSetting.js";
import Dropzone from "./Dropzone.js";
import "./utils/interact";
import ICONexConnection from "./utils/interact";
import cfg from "../config.json";
import axios from "axios";

const AppContent = () => {
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const handleShowCollectionModal = () => setShowCollectionModal(true);
  const handleCloseCollectionModal = () => setShowCollectionModal(false);

  const [showPinataModal, setShowPinataModal] = useState(false);
  const handleShowPinataModal = () => setShowPinataModal(true);
  const handleClosePinataModal = () => setShowPinataModal(false);
  const [contractInfo, setContractInfo] = useState([]);
  const [contractInfoLength, setContractInfoLen] = useState(0);

  const getUserTransaction = async () => {
    const connection = new ICONexConnection();

    let url_with_address =
      "https://sejong.tracker.solidwallet.io/v3/address/txList?page=1&count=100&address=" +
      cfg.LOCAL_WALLET_ADDRESS;
    let contract_container = [];
    let response = await axios.get(url_with_address).then((res) => {
      return res.data;
    });
    let totalTransactions = response.totalSize;
    let totalPages = totalTransactions / 100;
    if (totalPages > Math.floor(totalPages)) {
      totalPages = Math.floor(totalPages) + 1;
    } else if (totalPages < 1) {
      totalPages = 1;
    }

    for (let page = 0; page < totalPages; page++) {
      url_with_address =
        `https://sejong.tracker.solidwallet.io/v3/address/txList?page=${
          page + 1
        }&count=100&address=` + cfg.LOCAL_WALLET_ADDRESS;

      const pageResponse = await axios.get(url_with_address).then((res) => {
        return res.data;
      });

      let transactions = pageResponse.data;
      for (let transaction of transactions) {
        if (transaction.txType == 3) {
          contract_container.push(transaction.txHash);
        }
      }
    }

    let contractDisplay = [];
    for (let contractAddress of contract_container) {
      let url_to_transaction =
        `https://sejong.tracker.solidwallet.io/v3/transaction/txDetail?txHash=` +
        contractAddress;

      let txResponses = await axios.get(url_to_transaction).then((res) => {
        return res.data;
      });
      //console.log(txResponses);
      let contractInfo = JSON.parse(txResponses.data.dataString);
      contractDisplay.push({
        name: contractInfo.params._name,
        symbol: contractInfo.params._symbol,
        contractAddress: txResponses.data.targetContractAddr,
      });
    }
    console.log(contractDisplay.length);
    setContractInfoLen(contractDisplay.length);
    // console.log("contract_display", contract_display);
    setContractInfo(contractDisplay);
    return contractDisplay;

    //document.getElementById("contract_display").innerHTML = contract_display;
    //console.log(contract_display)

    // let contract_xinfo = await connection.retrieve_all_user_transaction(
    //   cfg.LOCAL_WALLET_ADDRESS //localStorage.getItem("WALLET_ADDRESS");
    // );

    // setContractInfo(contract_xinfo);
    // console.log(contractInfo.length);
    // console.log("xinfo", contract_xinfo.length);
  };

  useEffect(() => {
    async function fetchMyAPI() {
      await getUserTransaction();
    }
    fetchMyAPI();
    //console.log("use effect", contractInfoLength);
  }, [contractInfoLength]);

  return (
    <div style={{ height: "calc(100vh - 91px)" }}>
      <Container style={{ padding: "25px" }}>
        <div className={AppContentStyle.sectionHeader}>
          <span style={{ float: "left" }}>Collections</span>
          <button
            className={AppContentStyle.btnAddContract}
            onClick={handleShowCollectionModal}
          >
            New Collection
          </button>
        </div>
        <div style={{ padding: "0 25px" }}>
          <Row>
            {contractInfo.map((info) => (
              <Col
                xs={6}
                md={4}
                style={{ marginBottom: "18px" }}
                key={info.contractAddress}
              >
                <Card id="card_style">
                  <div id="card_div_style">
                    <span id="card_div_span_style">{info.name}</span>
                    <div id="card_div_div_style">
                      <label id="card_div_label_style">{info.symbol}</label>
                    </div>
                  </div>
                  <span id="card_div_div_span_style">
                    {info.contractAddress}
                  </span>
                  <a href="www.google.com" className="stretched-link"></a>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>

      <Modal show={showCollectionModal} onHide={handleCloseCollectionModal}>
        <NewCollection
          modalProps={[showCollectionModal, setShowCollectionModal]}
          usertxFunc={[contractInfoLength, setContractInfoLen]}
        />
      </Modal>

      <Container style={{ padding: "25px" }}>
        <div className={AppContentStyle.sectionHeader}>
          <span style={{ float: "left" }}>Upload Files to IPFS Storage</span>
          <button
            className={AppContentStyle.btnAddContract}
            onClick={handleShowPinataModal}
          >
            Configure API
          </button>
        </div>
        <div style={{ padding: "0 25px" }}>
          <Dropzone />
        </div>
      </Container>
      <Modal show={showPinataModal} onHide={handleClosePinataModal}>
        <PinataSetting modalProps={[showPinataModal, setShowPinataModal]} />
      </Modal>
    </div>
  );
};

export default AppContent;
