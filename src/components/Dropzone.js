import React, { Component } from "react";
import { Col, Row, Button } from "react-bootstrap";
import "./global.css";
import FormData from "form-data";
const axios = require("axios");

class Dropzone extends Component {
  blobData = [];
  constructor(props) {
    super(props);
    this.state = {
      file: this.blobData,
      pinataAuthenticated: "hello",
    };
    this.pinataKey = localStorage.getItem("pinataKey");
    this.pinataSecret = localStorage.getItem("pinataSecret");
  }

  handleBrowseFiles = (event) => {
    this.fileUploader.click();
    event.preventDefault();
  };

  handleUploadFiles = () => {
    if (this.blobData.length == 0) {
      alert("no files found, please upload file");
    }

    let data = new FormData();
    for (var i = 0; i < this.blobData.length; i++) {
      data.append(`file`, this.blobData[i].dataFile);
    }

    // const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    // axios
    //   .post(pinataEndpoint, data, {
    //     maxContentLength: "Infinity",
    //     headers: {
    //       "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
    //       pinata_api_key: "295a526cef20b63d813c",
    //       pinata_secret_api_key:
    //         "f57c393914f6a30ac78b7a8641726a62c7285d12014adfe56e52686d5fdb03ff",
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     console.log(data.toString());
    //   });
  };

  handleDropFolder = async (event) => {
    event.preventDefault();
    const files = event.target.files;

    const ipfsHash = "QmVQnSoCbCCTodGMhmnXWUb3sb7jAHQv5Z4S1ktzNdxzjz";
    const ipfsGateway = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`; //gateway might change so its stored as ipfs:// ; opensea decides gateway

    const metaData = [];
    for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const imgBlob = URL.createObjectURL(files[fileIndex]);
      this.blobData.push({
        name: files[fileIndex].name,
        blob: imgBlob,
        dataFile: files[fileIndex],
      });
      metaData.push({
        image: `${ipfsGateway}/${files[fileIndex].name}`,
      });
    }
    console.log(metaData);

    let data = new FormData();
    const testFile = new File([JSON.stringify(metaData[0])], "0.json", {
      type: "application/json",
    });
    const testFile2 = new File([JSON.stringify(metaData[0])], "1.json", {
      type: "application/json",
    });
    data.append(`file`, testFile, { filepath: `./${testFile.name}` });
    data.append(`file`, testFile2, { filepath: `./${testFile.name}` });

    console.log(testFile);
    const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    axios
      .post(pinataEndpoint, data, {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: "295a526cef20b63d813c",
          pinata_secret_api_key:
            "f57c393914f6a30ac78b7a8641726a62c7285d12014adfe56e52686d5fdb03ff",
        },
      })
      .then((res) => {
        console.log(res);
        console.log(data.toString());
      });

    this.setState({ file: this.blobData });
  };

  render() {
    return (
      <>
        <div
          style={{
            padding: "25px 25px",
            border: "1px solid #5d2985",
            borderRadius: "0.25rem",
            maxHeight: "400px",
            overflowY: "auto",
          }}
          onClick={this.handleBrowseFiles}
        >
          <span style={{ color: "#5d2985" }}>browse folder</span>
          <div
            id="gallery"
            style={{ paddingTop: this.blobData.length == 0 ? "0px" : "25px" }}
          >
            <Row>
              {(this.blobData || []).map((data, i) => (
                <Col key={i} xs={2} style={{ marginBottom: "15px" }}>
                  <div style={{ padding: "5px" }}>
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
        </div>
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
          style={{ float: "right", marginTop: "15px" }}
          onClick={this.handleUploadFiles}
        >
          Upload
        </Button>
      </>
    );
  }
}

export default Dropzone;
