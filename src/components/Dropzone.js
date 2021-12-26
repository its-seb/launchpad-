import IconService from "icon-sdk-js";
import "./app_content.css";
import React, { Component } from "react";
import ICONexConnection from "./utils/interact.js";
import { Navigate } from 'react-router-dom';
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

class Dropzone extends Component {
  uploadedFiles = [];
  constructor(props) {
    super(props);
    this.state = {
      file: this.uploadedFiles,
      // pinataAuthenticated: "hello",
      pinningImageProgress: 0,
      generatingJsonProgress: 0,
      pinningJsonProgress: 0,
      totalProgress: 0,
      show: false,
      uploadMessage: "",
      complete: false,
      redirect: false,
    };
    const provider = new IconService.HttpProvider(
      "https://sejong.net.solidwallet.io/api/v3"
    );

    this.iconService = new IconService(provider);
    this.pinataKey = localStorage.getItem("PINATA_KEY");
    this.pinataSecret = localStorage.getItem("PINATA_SECRET");
    this.showUploadModal = this.showUploadModal.bind(this);
    // this.hideUploadModal = this.hideUploadModal.bind(this);
    this.contractAddress = localStorage.getItem("SELECTED_CONTRACT_ADDRESS");
    this.walletAddress = localStorage.getItem("USER_WALLET_ADDRESS");
    this.connection = new ICONexConnection();
  }

  set_totalandcurrent_supply = async (num_of_file, metahash, jsonmetahash) => {
    const txObj = new IconBuilder.CallTransactionBuilder()
      .from(this.walletAddress)
      .to(this.contractAddress)
      .stepLimit(IconConverter.toBigNumber(2000000))
      .nid("0x53")
      .nonce(IconConverter.toBigNumber(1))
      .version(IconConverter.toBigNumber(3)) //constant
      .timestamp(new Date().getTime() * 1000)
      .method("setInitialSupplyAndMetahashAndJSONMetahash")
      .params({ _supply: IconService.IconConverter.toHex(num_of_file), _metahash: metahash, _jsonfilemetahash: jsonmetahash })
      .build();

    console.log("total_supply_txObj", txObj);

    const payload = {
      jsonrpc: "2.0",
      method: "icx_sendTransaction",
      id: 6639,
      params: IconConverter.toRawTransaction(txObj),
    };
    console.log("Total and Current Supply payload", payload);
    let rpcResponse = await this.connection.getJsonRpc(payload);
    console.log("Total and Current Supply payload rpcresponse", rpcResponse);
    alert("upload complete");

    this.getTotalSupply();
    this.setState({ redirect: true });
  };

  // set_JSON_File_Metahash = async (metahash) => {
  //   console.log("trying to set the json file metahash", metahash)
  //   const txObj = new IconBuilder.CallTransactionBuilder()
  //     .from(this.walletAddress)
  //     .to(this.contractAddress)
  //     .stepLimit(IconConverter.toBigNumber(2000000))
  //     .nid("0x53")
  //     .nonce(IconConverter.toBigNumber(1))
  //     .version(IconConverter.toBigNumber(3)) //constant
  //     .timestamp(new Date().getTime() * 1000)
  //     .method("setJSONFileMetahash")
  //     .params({ _jsonfilemetahash: metahash })
  //     .build();

  //   const payload = {
  //     jsonrpc: "2.0",
  //     method: "icx_sendTransaction",
  //     id: 6639,
  //     params: IconConverter.toRawTransaction(txObj),
  //   };
  //   let rpcResponse = await this.connection.getJsonRpc(payload);
  //   console.log("Set JSONFILEMETAHASH", rpcResponse);
  // };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Navigate to='/launch' />
    }
  }

  showUploadModal = () => {
    this.setState({ show: true });
  };

  hideUploadModal = () => {
    this.setState({ show: false });
  };

  handleBrowseFiles = (event) => {
    this.fileUploader.click();
    event.preventDefault();
  };

  handleUploadFiles = async () => {
    if (this.uploadedFiles.length == 0) {
      alert("no files found, please upload file");
    }

    this.showUploadModal();

    //step 1 - pin image
    this.setState({ uploadMessage: "Uploading image file..." });
    let data = new FormData();
    for (var i = 0; i < this.uploadedFiles.length; i++) {
      console.log(this.uploadedFiles[i]);
      data.append(
        `file`,
        this.uploadedFiles[i].dataFile,
        `file/${this.uploadedFiles[i].name}`
      );
    }

    const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    let response = await axios
      .post(pinataEndpoint, data, {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: this.pinataKey,
          pinata_secret_api_key: this.pinataSecret,
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          console.log("total", total);
          const currentProgress = Math.round(((loaded * 100) / total) * 0.5);

          console.log("current progress for ", currentProgress);
          this.setState({
            pinningImageProgress: currentProgress,
            totalProgress: currentProgress,
          });
        },
      })
      .then((res) => {
        console.log("file", res);
        console.log(data.toString());
        this.setState({
          pinningImageProgress: 60,
          totalProgress: 60,
        });
        return res;
      });

    //step 2 - generate meta data json file

    this.setState({ uploadMessage: "Generating metadata file..." });
    const json_uploadfiles = { files_link: [] };
    const ipfsHash = response.data.IpfsHash;
    const ipfsGateway = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`; //gateway might change so its stored as ipfs:// ; opensea decides gateway
    let mdata = new FormData();
    for (var i = 0; i < this.uploadedFiles.length; i++) {
      json_uploadfiles.files_link.push(`${ipfsGateway}/${this.uploadedFiles[i].name}`)
      const mdataContent = {
        image: `${ipfsGateway}/${this.uploadedFiles[i].name}`,
      };
      const mdataFile = new File([JSON.stringify(mdataContent)], `${i}.json`, {
        type: "application/json",
      });
      mdata.append(`file`, mdataFile, `mdata/${i}.json`);
      const currentProgress = Math.round(
        ((i + 1) / this.uploadedFiles.length) * 20
      );
      this.setState({
        generatingJsonProgress: currentProgress,
        totalProgress: this.state.pinningImageProgress + currentProgress,
      });
      console.log("current prog at generating json", currentProgress);
    }
    console.log(json_uploadfiles)

    const pinataEndpoint2 = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
    let json_upload_response = await axios.post(pinataEndpoint2, json_uploadfiles, {
      headers: {
        'pinata_api_key': this.pinataKey,
        'pinata_secret_api_key': this.pinataSecret
      }
    }
    ).then((response) => {
      console.log(response)
      return response.data.IpfsHash
      // let json_upload_hashlink = response.data.IpfsHash;
      // console.log("yoohoo", json_upload_hashlink);
      //work it here
      // this.set_JSON_File_Metahash(json_upload_hashlink);
    }).catch((error) => {
      console.log(error)
    });
    console.log(json_upload_response);
    // this.set_JSON_File_Metahash(json_upload_response);

    // step 3 - pin json file
    this.setState({ uploadMessage: "Uploading metadata file..." });
    let mresponse = await axios
      .post(pinataEndpoint, mdata, {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: this.pinataKey,
          pinata_secret_api_key: this.pinataSecret,
        },
        onUploadProgress: (progressEvent) => {
          console.log(progressEvent);
          const { loaded, total } = progressEvent;
          console.log("total", total);
          console.log("loaded", loaded);
          const currentProgress = Math.round(((loaded * 100) / total) * 0.15);

          console.log("current prog at pinning meta", currentProgress);
          const newTotalProgress =
            this.state.pinningImageProgress +
            this.state.generatingJsonProgress +
            currentProgress;
          console.log("new total prog", newTotalProgress);
          this.setState({
            pinningJsonProgress: currentProgress,
            totalProgress:
              this.state.pinningImageProgress +
              this.state.generatingJsonProgress +
              currentProgress,
          });
        },
      })
      .then((res) => {
        // this.updateMetahash(res.data.IpfsHash);
        this.set_totalandcurrent_supply(json_uploadfiles.files_link.length, res.data.IpfsHash, json_upload_response);
        //update dexie here
        console.log("metadata", res);
        this.setState({
          pinningJsonProgress: 20,
          totalProgress: 100,
        });
        this.hideUploadModal();
        this.props.meta();
      });
  };

  handleDropFiles = async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
      const imgBlob = URL.createObjectURL(files[i]);
      this.uploadedFiles.push({
        name: files[i].name,
        blob: imgBlob,
        dataFile: files[i],
      });
    }

    this.setState({ file: this.uploadedFiles });
    var x = document.getElementById("bruh");
    x.style.display = "none";
  };

  getTotalSupply = async () => {
    const callObj = new IconBuilder.CallBuilder()
      .from(null)
      .to(this.contractAddress)
      .method("getTotalSupply")
      .build();

    console.log(callObj);

    let result = await this.iconService
      .call(callObj)
      .execute()
      .then((response) => {
        console.log("Total Supply is", response);
        return response;
      })
      .catch((error) => {
        console.log("Total Supply Error", error);
        Promise.resolve({ error });
      });
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
    data.append(`file`, testFile, `metadata/${testFile.name}`);
    data.append(`file`, testFile2, `metadata/${testFile2.name}`);
    // data.append(`file`, testFile2, { filepath: `./${testFile.name}` });

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

  remove_file(file_index) {
    let updated_uploadedFile = [];
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      if (i != file_index.i) {
        updated_uploadedFile.push(this.uploadedFiles[i]);
      }
    }
    this.uploadedFiles = updated_uploadedFile;
    this.setState({ file: this.uploadedFiles });
    var x = document.getElementById("bruh");
    if (this.uploadedFiles.length == 0) {
      x.style.display = "block";
    }
  }

  render() {
    return (
      <Container
        onDrop={this.handleDropFiles}
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
        <Row style={{ marginTop: "10px" }}>
          <Col>
            <Card className="upload-card unselectable">
              <div
                style={{
                  paddingBottom: "10px",
                  paddingTop: this.uploadedFiles.length == 0 ? "0px" : "5px",
                }}
              >
                <div id="bruh">
                  <PhotographIcon
                    style={{ width: "10rem", color: "#494a66" }}
                  />
                  <span
                    style={{
                      display: "block",
                      color: "#494a66",
                      fontSize: "2rem",
                      fontWeight: "500",
                    }}
                  >
                    drag and drop files
                  </span>
                </div>
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
                          onClick={(e) => this.remove_file({ i })}
                        ></i>
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
        <Modal show={this.state.show}>
          <div style={{ padding: "25px 25px" }}>
            <span
              style={{
                fontSize: "larger",
                fontWeight: "bold",
                color: "#525252",
              }}
            >
              {this.state.uploadMessage}
            </span>
            <ProgressBar
              id="pbUpload"
              animated
              style={{ marginTop: "15px" }}
              now={this.state.totalProgress}
              label={`${this.state.totalProgress}%`}
            ></ProgressBar>
          </div>
        </Modal>
        {this.renderRedirect()}
      </Container>
    );
  }
}

export default Dropzone;
