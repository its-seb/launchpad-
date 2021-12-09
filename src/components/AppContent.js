import React, { useState } from "react";
import { Container, Button, Row, Col, Card, Modal } from "react-bootstrap";
import AppContentStyle from "./AppContent.module.css";
import NewCollection from "./NewCollection.js";
import PinataSetting from "./PinataSetting.js";
import Dropzone from "./Dropzone.js";

const AppContent = () => {
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const handleShowCollectionModal = () => setShowCollectionModal(true);
  const handleCloseCollectionModal = () => setShowCollectionModal(false);

  const [showPinataModal, setShowPinataModal] = useState(false);
  const handleShowPinataModal = () => setShowPinataModal(true);
  const handleClosePinataModal = () => setShowPinataModal(false);

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
            <Col>
              <Card style={{ border: "1px solid #7030a0" }}>
                <div
                  style={{
                    display: "flex",
                    paddingLeft: "12px",
                    paddingTop: "5px",
                    paddingRight: "12px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      color: "#525252",
                    }}
                  >
                    Billy
                  </span>
                  <div style={{ width: "100%", textAlign: "right" }}>
                    <label
                      style={{
                        verticalAlign: "sub",
                        backgroundColor: "#7030a0",
                        color: "white",
                        paddingLeft: "8px",
                        paddingRight: "8px",
                        borderRadius: "0.5rem",
                      }}
                    >
                      Bill
                    </label>
                  </div>
                </div>
                <span
                  style={{
                    padding: "5px 15px 10px 15px",
                    textAlign: "left",
                    fontWeight: "bold",
                    color: "#525252",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  hxbd1375315c7732779edaa4c3903ffc9b93e82ca3
                </span>
              </Card>
            </Col>
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
