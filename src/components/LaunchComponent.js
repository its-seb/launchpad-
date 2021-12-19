import React, { Component } from "react";
import {
  Form,
  Button,
  Container,
  Modal,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { PhotographIcon } from "@heroicons/react/solid";

export class LaunchComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collectionName: "default",
      nftMintPrice: 0,
      collectionCover: "",
    };
  }

  componentDidMount() {
    document.getElementById("_pageTitle").innerText = this.props.pageTitle;
  }

  handleCollectionName = () => {
    this.setState({
      collectionName: document.getElementById("tbCollectionName").value,
    });
  };

  handleMintPrice = () => {
    this.setState({
      nftMintPrice: document.getElementById("tbMintPrice").value,
    });
  };

  render() {
    return (
      <div style={{ height: "75vh" }}>
        <Container>
          <Row style={{ marginTop: "10px" }}>
            <Col xs={4} md={4} lg={4}>
              <Form.Floating
                className="mb-3 unselectable"
                style={{ marginTop: "25px" }}
              >
                <Form.Control
                  id="tbCollectionName"
                  type="text"
                  placeholder="Collection Name"
                  className="modal-form-control"
                  onChange={this.handleCollectionName}
                />
                <label htmlFor="tbCollectionName" style={{ color: "#525252" }}>
                  Collection Name
                </label>
              </Form.Floating>

              <Form.Floating
                className="mb-3 unselectable"
                style={{ marginTop: "25px" }}
              >
                <Form.Control
                  id="tbMintPrice"
                  type="text"
                  placeholder="Mint Price"
                  className="modal-form-control"
                  onChange={this.handleMintPrice}
                />
                <label htmlFor="tbMintPrice" style={{ color: "#525252" }}>
                  Mint Price
                </label>
              </Form.Floating>
              <Form.Floating
                className="mb-3 unselectable"
                style={{ marginTop: "25px" }}
              >
                <Form.Control
                  id="tbLaunchDate"
                  type="text"
                  placeholder="Mint Price"
                  className="modal-form-control"
                />
                <label htmlFor="tbLaunchDate" style={{ color: "#525252" }}>
                  Launch Date
                </label>
              </Form.Floating>

              <Form.Floating
                className="mb-3 unselectable"
                style={{ marginTop: "25px" }}
              >
                <Card className="upload-card unselectable">
                  <div style={{ paddingBottom: "10px" }}>
                    <PhotographIcon
                      style={{ width: "5rem", color: "#494a66" }}
                    />
                    <span
                      style={{
                        display: "block",
                        color: "#494a66",
                        fontSize: "1rem",
                        fontWeight: "500",
                      }}
                    >
                      drag and drop collection cover image
                    </span>
                  </div>
                </Card>
              </Form.Floating>
              <Button
                id="btnPublish"
                className="modal-form-submit"
                style={{ marginTop: "5px", padding: "0.5rem" }}
              >
                publish
              </Button>
            </Col>
            <Col xs={8} md={8} lg={8}>
              <Card className="preview-card unselectable">
                <div
                  style={{
                    backgroundColor: "#323232",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      padding: "25px",
                      margin: "auto",
                      marginTop: "5rem",
                      backgroundColor: "white",
                      width: "20rem",
                      height: "25rem",
                      borderRadius: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        textAlign: "left",
                        marginTop: "-10px",
                        marginBottom: "5px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "#323232",
                        }}
                      >
                        {this.state.collectionName}
                      </span>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#323232",
                        width: "100%",
                        height: "60%",
                      }}
                    ></div>
                    <div style={{ marginTop: "15px", textAlign: "right" }}>
                      <span>Price: {this.state.nftMintPrice} ICX</span>
                    </div>
                    <Button
                      style={{
                        marginTop: "15px",
                        float: "right",
                        backgroundColor: "#323232",
                        width: "100%",
                        padding: "10px",
                      }}
                    >
                      Mint NFT
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default LaunchComponent;
