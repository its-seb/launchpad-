import "./app_content.css";
import React, { Component } from "react";
import { Col, Row, Button, ProgressBar, Modal } from "react-bootstrap";
import "./global.css";
const axios = require("axios");

class Dropzone extends Component {
  uploadedFiles = [];
  constructor(props) {
    super(props);
    this.state = {
      file: this.uploadedFiles,
      pinataAuthenticated: "hello",
      pinningImageProgress: 0,
      generatingJsonProgress: 0,
      pinningJsonProgress: 0,
      totalProgress: 0,
      show: false,
      uploadMessage: "",
    };
    this.pinataKey = localStorage.getItem("pinataKey");
    this.pinataSecret = localStorage.getItem("pinataSecret");

    this.showUploadModal = this.showUploadModal.bind(this);
    // this.hideUploadModal = this.hideUploadModal.bind(this);
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
          pinata_api_key: "295a526cef20b63d813c",
          pinata_secret_api_key:
            "f57c393914f6a30ac78b7a8641726a62c7285d12014adfe56e52686d5fdb03ff",
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
    const ipfsHash = response.data.IpfsHash;
    const ipfsGateway = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`; //gateway might change so its stored as ipfs:// ; opensea decides gateway
    let mdata = new FormData();
    for (var i = 0; i < this.uploadedFiles.length; i++) {
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

    //step 3 - pin json file
    this.setState({ uploadMessage: "Uploading metadata file..." });
    let mresponse = await axios
      .post(pinataEndpoint, mdata, {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: "295a526cef20b63d813c",
          pinata_secret_api_key:
            "f57c393914f6a30ac78b7a8641726a62c7285d12014adfe56e52686d5fdb03ff",
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
        console.log("metadata", res);
        console.log(data.toString());
        this.setState({
          pinningJsonProgress: 20,
          totalProgress: 100,
        });
        return res;
      });

    //this.hideUploadModal();
    alert("upload complete");
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
  };

  // handleDropFolder = async (event) => {
  //   event.preventDefault();
  //   const files = event.target.files;

  //   const ipfsHash = "QmVQnSoCbCCTodGMhmnXWUb3sb7jAHQv5Z4S1ktzNdxzjz";
  //   const ipfsGateway = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`; //gateway might change so its stored as ipfs:// ; opensea decides gateway

  //   const metaData = [];
  //   for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
  //     const imgBlob = URL.createObjectURL(files[fileIndex]);
  //     this.blobData.push({
  //       name: files[fileIndex].name,
  //       blob: imgBlob,
  //       dataFile: files[fileIndex],
  //     });
  //     metaData.push({
  //       image: `${ipfsGateway}/${files[fileIndex].name}`,
  //     });
  //   }
  //   console.log(metaData);

  //   let data = new FormData();
  //   const testFile = new File([JSON.stringify(metaData[0])], "0.json", {
  //     type: "application/json",
  //   });
  //   const testFile2 = new File([JSON.stringify(metaData[0])], "1.json", {
  //     type: "application/json",
  //   });
  //   data.append(`file`, testFile, `metadata/${testFile.name}`);
  //   data.append(`file`, testFile2, `metadata/${testFile2.name}`);
  //   // data.append(`file`, testFile2, { filepath: `./${testFile.name}` });

  //   console.log(testFile);
  //   const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  //   axios
  //     .post(pinataEndpoint, data, {
  //       maxContentLength: "Infinity",
  //       headers: {
  //         "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
  //         pinata_api_key: "295a526cef20b63d813c",
  //         pinata_secret_api_key:
  //           "f57c393914f6a30ac78b7a8641726a62c7285d12014adfe56e52686d5fdb03ff",
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       console.log(data.toString());
  //     });

  //   this.setState({ file: this.blobData });
  // };

  remove_file(file_index) {
    let updated_uploadedFile = [];
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      if (i != file_index.i) {
        updated_uploadedFile.push(this.uploadedFiles[i]);
      }
    }
    this.uploadedFiles = updated_uploadedFile;
    this.setState({ file: this.uploadedFiles });
  }

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
          // onClick={this.handleBrowseFiles}
        >
          <span style={{ color: "#5d2985" }}>drag and drop files</span>
          <div
            id="gallery"
            style={{
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
      </>
    );
  }
}

export default Dropzone;
