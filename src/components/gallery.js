import IconService from "icon-sdk-js";
import "./app_content.css";
import React, { Component } from "react";
import ICONexConnection from "./utils/interact.js";
import { Navigate } from "react-router-dom";
import { create } from "ipfs-http-client";
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
    uploadedFiles = [];
    constructor(props) {
        super(props);
        this.state = {
            file: this.uploadedFiles,
            metahash: this.props.metahash
        }
        
    }
    

    render() {
        return (
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
                                    {(this.uploadedFiles || []).map((data, i) => (
                                        <Col key={i} xs={2} style={{ marginBottom: "10px" }}>
                                            <div style={{ padding: "5px", position: "relative" }}>
                                                <img
                                                    src={data.blob}
                                                    style={{
                                                        width: "100%",
                                                        display: "block",
                                                        margin: "auto",
                                                        border: "1px solid #c9c9c9",
                                                    }}
                                                ></img>
                                                <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                                                    {data.name}
                                                </span>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <input
                    type="file"
                    id="files"
                    ref={(input) => (this.fileUploader = input)}
                    style={{ display: "none" }}
                    webkitdirectory=""
                    multiple=""
                    directory=""
                    onChange={this.handleDropFolder}
                ></input>
                <Button
                    id="btnUpload"
                    style={{ marginTop: "20px", padding: "0.5rem" }}
                    onClick={this.handleUploadFiles}
                >
                    upload
                </Button>
            </Container>
        );
    }
}

export default Gallery;
