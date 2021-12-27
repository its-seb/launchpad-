import IconService from "icon-sdk-js";
import "./app_content.css";
import React, { Component } from "react";
import ICONexConnection, { sleep } from "./utils/interact.js";
import FailureComponent from "./FailureComponent.js";
import SuccessComponent from "./SuccessComponent.js";
import Dexie from "dexie";
import Compressor from "compressorjs";
import { Navigate } from "react-router-dom";
import {
  Button,
  Container,
  Modal,
  Row,
  Col,
  Card,
  Spinner,
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

    this.db = new Dexie("contracts_deployed");
    this.db.version(1).stores({
      contracts: "contractAddress, walletAddress, name, symbol",
    });
    this.db.open().catch((error) => {
      console.log("error", error);
    });
  }

  set_totalandcurrent_supply = async (
    num_of_file,
    metahash,
    jsonmetahash,
    jsonthumbnailmetahash
  ) => {
    const txObj = new IconBuilder.CallTransactionBuilder()
      .from(this.walletAddress)
      .to(this.contractAddress)
      .stepLimit(IconConverter.toBigNumber(2000000))
      .nid("0x53")
      .nonce(IconConverter.toBigNumber(1))
      .version(IconConverter.toBigNumber(3)) //constant
      .timestamp(new Date().getTime() * 1000)
      .method("setInitialSupplyAndMetahashAndJSONMetahash")
      .params({
        _supply: IconService.IconConverter.toHex(num_of_file),
        _metahash: metahash,
        _jsonfilemetahash: jsonmetahash,
        _jsonthumbnailmetahash: jsonthumbnailmetahash,
      })
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
    //alert("upload complete");

    this.getTotalSupply();
    return rpcResponse;
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Navigate to="/launch" />;
    }
  };

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

  handleCompressedUpload = (file) => {
    let x = new Compressor(file, {
      quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.
        return compressedResult;
        // console.log(compressedResult)
        // console.log(typeof (compressedResult))
      },
    });
    return x.file;
  };

  createImageFormData = (files) => {
    let originalData = new FormData();
    let thumbnailData = new FormData();
    for (var i = 0; i < files.length; i++) {
      console.log("createImageFormData", files[i]);
      //For original full Resolution File
      originalData.append(`file`, files[i].dataFile, `file/${files[i].name}`);

      //For Compressed File
      thumbnailData.append(
        `file`,
        this.handleCompressedUpload(files[i].dataFile),
        `file/thumbnail_${files[i].name}`
      );
    }
    return [originalData, thumbnailData];
  };

  pinMultipleFilesToIPFS = async (formData, displayedObjName) => {
    const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const metadata = JSON.stringify({ name: displayedObjName });
    formData.append("pinataMetadata", metadata);
    let response = await axios
      .post(pinataEndpoint, formData, {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: this.pinataKey,
          pinata_secret_api_key: this.pinataSecret,
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          console.log("total ", total, " for ", displayedObjName);
          const currentProgress = Math.round(((loaded * 100) / total) * 0.5);

          console.log(
            "current progress for ",
            displayedObjName,
            currentProgress
          );
        },
      })
      .then((res) => {
        //        console.log(displayedObjName, "   ", res);
        return res;
      }); //will probably have to handle error here
    return response;
  };

  createJsonFormData = (files, ipfsHash) => {
    let combinedJson = { files_link: [] };
    const ipfsFolderHash = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`; //gateway might change so its stored as ipfs:// ; opensea decides gateway
    let data = new FormData();

    for (var i = 0; i < files.length; i++) {
      combinedJson.files_link.push({
        link: `${ipfsFolderHash}/${files[i].name}`,
        name: `${files[i].name}`,
      });

      const individualJson = {
        image: `${ipfsFolderHash}/${this.uploadedFiles[i].name}`,
      };

      const jsonFile = new File([JSON.stringify(individualJson)], `${i}.json`, {
        type: "application/json",
      });
      data.append(`file`, jsonFile, `data/${i}.json`);
    }
    return [combinedJson, data];
  };

  pinJsonToIPFS = async (content) => {
    const pinataEndpoint = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
    let response = await axios
      .post(pinataEndpoint, content, {
        headers: {
          pinata_api_key: this.pinataKey,
          pinata_secret_api_key: this.pinataSecret,
        },
      })
      .then((response) => {
        console.log("pinJsonToIPFS", response);
        return response.data.IpfsHash;
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  };

  handleUploadFiles = async () => {
    if (this.uploadedFiles.length == 0) {
      alert("no files found, please upload file");
      return;
    }

    this.showUploadModal();
    //step 1 - pin original res image
    this.setState({ uploadMessage: "pinning image files to pinata..." });
    let [originalData, thumbnailData] = this.createImageFormData(
      this.uploadedFiles
    );
    console.log("original data", originalData);
    console.log("thumbnailData", thumbnailData);
    let originalResponse = await this.pinMultipleFilesToIPFS(
      originalData,
      "original_res"
    );
    let thumbnailResponse = await this.pinMultipleFilesToIPFS(
      thumbnailData,
      "thumbnail_res"
    );
    console.log("original res", originalResponse);
    console.log("thumbnail res", thumbnailResponse);

    //step 2 generate metadata json file
    this.setState({ uploadMessage: "pinning metadata to pinata..." });
    let [originalCombinedJson, originalJsonData] = this.createJsonFormData(
      this.uploadedFiles,
      originalResponse.data.IpfsHash
    );
    let [thumbnailCombinedJson, thumbnailJsonData] = this.createJsonFormData(
      this.uploadedFiles,
      thumbnailResponse.data.IpfsHash
    );

    console.log("original combined Json", originalCombinedJson);
    console.log("originalJsonData", originalJsonData);
    console.log("thumbnailCombinedJson", thumbnailCombinedJson);
    console.log("thumbnailJsonData", thumbnailJsonData);

    let combjson_originalResponse = await this.pinJsonToIPFS(
      originalCombinedJson
    );
    let combjson_thumbnailResponse = await this.pinJsonToIPFS(
      thumbnailCombinedJson
    );

    console.log("combined josn_original res", combjson_originalResponse);
    console.log("combined josn_thumbnail res", combjson_thumbnailResponse);

    //upload metadata
    let metadata_response = await this.pinMultipleFilesToIPFS(
      originalJsonData,
      "json_metadata"
    );
    console.log("metadata_response", metadata_response);

    //this.showUploadModal();

    //update contract
    this.setState({ uploadMessage: "updating score..." });
    let rpcResponse = await this.set_totalandcurrent_supply(
      this.uploadedFiles.length,
      metadata_response.data.IpfsHash,
      combjson_originalResponse,
      combjson_thumbnailResponse
    ).then(() => {
      this.db.contracts.update(this.contractAddress, {
        metahash_exist: true,
      });
      localStorage.setItem("HAS_METAHASH", true);
      document.getElementById("deploymentLoading").style.display = "none";
      document.getElementById("deploymentSuccess").style.display = "block";
      this.setState({ uploadMessage: "files uploaded successfully!" });
    });

    await sleep(1000);
    this.setState({ uploadMessage: "redirecting to launchpage..." });

    await sleep(1500);
    this.setState({ redirect: true });
  };

  handleDropFiles = async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
      const imgBlob = URL.createObjectURL(files[i]);
      console.log(imgBlob);
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
        <Button
          id="btnUpload"
          style={{ marginTop: "20px", padding: "0.5rem" }}
          onClick={this.handleUploadFiles}
        >
          upload
        </Button>
        <Modal show={this.state.show}>
          <div style={{ padding: "25px 25px" }}>
            <div id="loading-container" style={{ display: "block" }}>
              <Spinner
                animation="border"
                id="deploymentLoading"
                style={{ display: "block" }}
              ></Spinner>
              <SuccessComponent id="deploymentSuccess" />
              <FailureComponent id="deploymentFailure" />
              <span id="deployText">{this.state.uploadMessage}</span>
            </div>
          </div>
        </Modal>
        {this.renderRedirect()}
      </Container>
    );
  }
}

export default Dropzone;
