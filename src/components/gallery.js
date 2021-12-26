import IconService from "icon-sdk-js";
import "./app_content.css";
import React, { Component } from "react";
import ICONexConnection from "./utils/interact.js";
import { Navigate } from "react-router-dom";
import {
  Button,
  Container,
  Modal,
  Row,
  Col,
  Card,
  ProgressBar,
} from "react-bootstrap";
import { PhotographIcon } from "@heroicons/react/solid";
import "./global.css";
import "./style.css";
const axios = require("axios");
const { IconConverter, IconBuilder, HttpProvider } = IconService;

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: this.uploadedFiles,
      metahash: this.props.metahash,
    };
    const provider = new IconService.HttpProvider(
      "https://sejong.net.solidwallet.io/api/v3"
    );
    this.uploadedFiles = [];
    this.jsonhash = "";
    this.iconService = new IconService(provider);
    this.contractAddress = localStorage.getItem("SELECTED_CONTRACT_ADDRESS");
  }
  getJSONFileMetahash = async () => {
    const callObj = new IconBuilder.CallBuilder()
      .from(null)
      .to(this.contractAddress)
      .method("getJSONFileMetahash")
      .build();

    let result = await this.iconService
      .call(callObj)
      .execute()
      .then((response) => {
        console.log("getJSONFileMetahash", response);
        this.jsonhash = response;
      })
      .catch((error) => {
        console.log("getJSONFileMetahash", error);
        Promise.resolve({ error });
      });
    return result;
  };

  async componentDidMount() {
    console.log("hello world");
    // await this.getJSONFileMetahash();
    // const pinataEndpoint3 = `https://gateway.pinata.cloud/ipfs/${this.jsonhash}`;
    // let json_upload_response = await axios.get(pinataEndpoint3)
    //     .then((response) => {
    //         this.uploadedFiles = response.data.files_link;
    //         console.log(this.uploadedFiles)
    //     }).catch((error) => {
    //         console.log(error)
    //     });
    // // console.log(json_upload_response);
  }

  render() {
    return (
      <div>
        <Container>
          <Row style={{ marginTop: "10px" }}>
            <Col>
              <Card className="upload-card unselectable">
                <div
                  style={{
                    paddingBottom: "10px",
                    paddingTop: this.uploadedFiles.length == 0 ? "0px" : "5px",
                  }}
                >
                  <Row>
                    {this.uploadedFiles.map((data) => (
                      <Col xs={2} style={{ marginBottom: "10px" }}>
                        <div style={{ padding: "5px", position: "relative" }}>
                          <img
                            src={data}
                            style={{
                              width: "100%",
                              display: "block",
                              margin: "auto",
                              border: "1px solid #c9c9c9",
                            }}
                          ></img>
                          <span
                            style={{ fontWeight: "bold", fontSize: "12px" }}
                          >
                            {/* {data.name} */}
                            hello
                          </span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Gallery;
