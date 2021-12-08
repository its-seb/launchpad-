import React, { useState } from "react";
import { Container, Button, Row, Col, Card, Modal } from "react-bootstrap";
import AppContentStyle from "./AppContent.module.css";
import NewCollection from "./NewCollection.js";

const AppContent = () => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div style={{ height: "calc(100vh - 91px)" }}>
      <Container style={{ padding: "25px" }}>
        <div className={AppContentStyle.sectionHeader}>
          <span style={{ float: "left" }}>Collections</span>
          <button
            className={AppContentStyle.btnAddContract}
            onClick={handleShow}
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
      <Modal show={show} onHide={handleClose}>
        <NewCollection modalProps={[show, setShow]} />
      </Modal>
      <Container style={{ padding: "25px" }}>
        <div className={AppContentStyle.sectionHeader}>
          <span style={{ float: "left" }}>Upload Files to IPFS Storage</span>
          <button
            className={AppContentStyle.btnAddContract}
            onClick={handleShow}
          >
            Configure API
          </button>
        </div>
      </Container>
    </div>
  );
};

export default AppContent;
