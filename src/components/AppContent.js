import "./app_content.css";
import React, { useState } from "react";
import { Container, Button, Row, Col, Card, Modal } from "react-bootstrap";
import AppContentStyle from "./AppContent.module.css";
import NewCollection from "./NewCollection.js";
import PinataSetting from "./PinataSetting.js";
import Dropzone from "./Dropzone.js";
import "./utils/interact";
import ICONexConnection from "./utils/interact";


const AppContent = () => {
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const handleShowCollectionModal = () => setShowCollectionModal(true);
  const handleCloseCollectionModal = () => setShowCollectionModal(false);

  const [showPinataModal, setShowPinataModal] = useState(false);
  const handleShowPinataModal = () => setShowPinataModal(true);
  const handleClosePinataModal = () => setShowPinataModal(false);
  const [contractInfo, setContractInfo] = useState([]);
  const getUserTransaction = async () => {
    const connection = new ICONexConnection;
    let contract_xinfo = await connection.retrieve_all_user_transaction("hxbd1375315c7732779edaa4c3903ffc9b93e82ca3");
    console.log(contract_xinfo)

    //localStorage.getItem("WALLET_ADDRESS");
    // return contract_xinfo;
    // setContractInfo(contract_xinfo);
    // return contract_xinfo;
  }
  // const connection = new ICONexConnection;
  // let contract_xinfo = connection.retrieve_all_user_transaction("hxbd1375315c7732779edaa4c3903ffc9b93e82ca3"); //localStorage.getItem("WALLET_ADDRESS");
  // contract_xinfo.then(function (result) {
  //   return result
  // })
  // console.log(contract_xinfo)


  // getUserTransaction();
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
        <div style={{ padding: "0 25px", border: "1px solid #7030a0" }}>
          <Row id="contract_display">

            {
              contractInfo.map(info =>
                <Col xs={6} md={4} style={{ marginBottom: "18px" }}>
                  <Card id="card_style">
                    <div id="card_div_style">
                      <span id="card_div_span_style">
                        {info.name}
                      </span>
                      <div id="card_div_div_style">
                        <label id="card_div_label_style">
                          {info.symbol}
                        </label>
                      </div>
                    </div>
                    <span id="card_div_div_span_style">
                      {info.contractAddress}
                    </span>
                    <a href="www.google.com" className="stretched-link"></a>
                  </Card>
                </Col>

              )
            }


            {/* <Col xs={6} md={4} style={{ marginBottom: "18px" }}>
              <Card id="card_style">
                <div id="card_div_style">
                  <span id="card_div_span_style">
                    {contract_info.name}
                  </span>
                  <div id="card_div_div_style">
                    <label id="card_div_label_style">
                      {contract_info.symbol}
                    </label>
                  </div>
                </div>
                <span id="card_div_div_span_style">
                  {info.contractAddress}
                </span>
                <a href="www.google.com" className="stretched-link"></a>
              </Card>
            </Col> */}


          </Row>
        </div>
      </Container>

      <Modal show={showCollectionModal} onHide={handleCloseCollectionModal}>
        <NewCollection
          modalProps={[showCollectionModal, setShowCollectionModal]}
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
