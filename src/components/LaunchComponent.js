import React, { Component } from "react";
import {
  Form,
  Button,
  Container,
  Modal,
  Row,
  Col,
  Card,
  Image,
} from "react-bootstrap";
import { PhotographIcon } from "@heroicons/react/solid";
import PreviewComponent from "./PreviewComponent.js";

export class LaunchComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collectionName: "default",
      nftMintPrice: 0,
      collectionCover: "",
      isUploaded: false,
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

  handleMintPrice = (event) => {
    const re = /^[0-9\b]+$/; //test for regex
    if (event.target.value === "" || re.test(event.target.value)) {
      this.setState({ nftMintPrice: event.target.value });
    }
  };

  handleDropFile = (event) => {
    event.preventDefault();
    if (event.dataTransfer.items.length > 1) {
      console.log("not allowed");
      return;
    }
    const imgBlob = URL.createObjectURL(event.dataTransfer.files[0]); //creating a blob url
    console.log(imgBlob);

    this.setState({ collectionCover: imgBlob });
  };

  handlePublishDapp = () => {
    console.log("hello world");
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
                  type="number"
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
                  type="date"
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
                <Card
                  className="upload-card unselectable"
                  onDrop={this.handleDropFile}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div id="dragAndDropPrompt" style={{ paddingBottom: "10px" }}>
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
                  <Col
                    id="dragAndDropPreview"
                    xs={2}
                    style={{ marginBottom: "10px" }}
                  >
                    <div style={{ padding: "5px", position: "relative" }}>
                      <img
                        src={this.state.collectionCover}
                        style={{
                          width: "100%",
                          display: "block",
                          margin: "auto",
                          border: "1px solid #c9c9c9",
                        }}
                      ></img>
                      <i
                        className="fa fa-times-circle"
                        style={{
                          fontSize: "25px",
                          color: "red",
                          position: "absolute",
                          top: "0px",
                          right: "-1px",
                          opacity: "0.6",
                        }}
                      ></i>
                    </div>
                  </Col>
                </Card>
              </Form.Floating>
              <Button
                id="btnPublish"
                className="modal-form-submit"
                style={{ marginTop: "5px", padding: "0.5rem" }}
                onClick={this.handlePublishDapp}
              >
                publish
              </Button>
            </Col>
            <Col xs={8} md={8} lg={8}>
              <PreviewComponent previewData={this.state} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default LaunchComponent;
