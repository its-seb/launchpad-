import "./app_content.css";
import React, { useState, useEffect, useReducer } from "react";
import { Container, Row, Col, Card, Modal } from "react-bootstrap";
import AppContentStyle from "./AppContent.module.css";
import NewCollection from "./NewCollection.js";
import PinataSetting from "./PinataSetting.js";
import Dropzone from "./Dropzone.js";
import "./utils/interact.js";
import ICONexConnection from "./utils/interact";
import cfg from "../config.json";
import Dexie from "dexie";
import axios from "axios";
import IconService from "icon-sdk-js";

const AppContent = () => {
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const handleShowCollectionModal = () => setShowCollectionModal(true);
  const handleCloseCollectionModal = () => setShowCollectionModal(false);

  const [showPinataModal, setShowPinataModal] = useState(false);
  const handleShowPinataModal = () => setShowPinataModal(true);
  const handleClosePinataModal = () => setShowPinataModal(false);
  const [contractInfo, setContractInfo] = useState([]);
  const [contractInfoLength, setContractInfoLen] = useState(0);
  const connection = new ICONexConnection();

  var db = new Dexie("contracts_deployed");
  db.version(1).stores({
    contracts: "contractAddress, walletAddress, name, symbol",
  });
  db.open().catch((error) => {
    console.log("error", error);
  });

  const getContractInfo = async () => {
    //check indexedDB data; if exists, pull contract info, else fallback
    const contractsCount = await db.contracts
      .where({
        walletAddress: cfg.LOCAL_WALLET_ADDRESS,
      })
      .count((count) => {
        return count;
      });

    //if no contracts found in db, fallback to txlist for confirmation
    if (contractsCount == 0) {
      let contractDisplay = await connection.getLaunchpadContracts(
        cfg.LOCAL_WALLET_ADDRESS
      );

      //prepare statement for bulk add to db.contracts
      var contractsToCommit = [];
      console.log(contractDisplay);
      for (let contract of contractDisplay) {
        contractsToCommit.push({
          contractAddress: contract.contractAddress,
          walletAddress: cfg.LOCAL_WALLET_ADDRESS,
          name: contract.name,
          symbol: contract.symbol,
        });
      }

      db.contracts
        .bulkAdd(contractsToCommit)
        .then((lastKey) => {
          console.log("last key added:", lastKey);
        })
        .catch(Dexie.BulkError, (e) => {
          console.error(
            "Some contracts did not succeed. However, " +
            contractDisplay.length -
            e.failures.length +
            " contracts was added successfully"
          );
        });
    }

    //query indexedDB to pull out all deployed contracts
    const contractsDeployed = await db.contracts
      .where({
        walletAddress: cfg.LOCAL_WALLET_ADDRESS,
      })
      .toArray();
    setContractInfo(contractsDeployed);
    setContractInfoLen(contractsDeployed.length);

    return contractsDeployed;
  };

  useEffect(() => {
    getContractInfo();
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
                onClick={() => connection.testMint(info.contractAddress)}
              >
                <Card id="card_style" type="button">
                  <div id="card_div_style">
                    <span id="card_div_span_style">{info.name}</span>
                    <div id="card_div_div_style">
                      <label id="card_div_label_style">o</label>
                    </div>
                  </div>
                  <span id="card_div_div_span_style">
                    {info.contractAddress}
                  </span>
                  {/* <a href="" className="stretched-link" onClick={() => {console.log("hi")}}></a> */}
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
