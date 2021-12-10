import React, { Component } from "react";
import { Col, Row, Button } from "react-bootstrap";
import "./global.css";
const axios = require("axios");
const fs = require("fs");

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

  handleDropEvent = async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    console.log("event", event);
    console.log("datatransfer", event.dataTransfer.files);
    for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
      //console.log(files[fileIndex]);
      const imgBlob = URL.createObjectURL(files[fileIndex]);
      let blobObj = await fetch(imgBlob).then((r) => r.blob());
      this.blobData.push({
        name: files[fileIndex].name,
        blob: imgBlob,
        blobObj: blobObj,
      });
      //console.log(this.blobData);
      //console.log(files[fileIndex]);
    }
    this.setState({ file: this.blobData });
  };

  //to do later; drag and drop for now
  handleBrowseFiles = (event) => {
    this.fileUploader.click();
    event.preventDefault();
  };

  handleUploadFiles = () => {
    if (this.blobData.length == 0) {
      alert("no files found, please upload file");
    }

    const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    let data = new FormData();
    var reader = new FileReader();
    for (var i = 0; i < this.blobData.length; i++) {
      data.append("file", this.blobData[i].blobObj, { filepath: "" });
    }

    data.append("wrapWithDirectory", "false");
    console.log(data);

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
      });

    // fetch(pinataEndpoint, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
    //     pinata_api_key: "295a526cef20b63d813c",
    //     pinata_secret_api_key:
    //       "f57c393914f6a30ac78b7a8641726a62c7285d12014adfe56e52686d5fdb03ff",
    //   },
    //   body: JSON.stringify({
    //     data,
    //   }),
    // }).then((response) => {
    //   console.log(response);
    // });
    // console.log(data);
    const uploadTest = async () => {
      let data = new FormData();
      var reader = new FileReader();
      for (var i = 0; i < this.blobData.length; i++) {
        //fetch(this.blobData[i].blob, { method: "GET" }).then((response) =>
        //  console.log(response.body)
        //);
        reader.readAsArrayBuffer(this.blobData[i].blob);
        reader.onloadend = () => {
          console.log(reader.result);
        };
      }
      // const responsePromise = await fetch(
      //   pinataEndpoint, //remember to throw everything into const file
      //   {
      //     method: "POST",
      //     body: JSON.stringify(txObj),
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
    };
  };

  handleDropFolder = async (event) => {
    event.preventDefault();
    console.log("event", event);
    console.log("event.target", event.target);
    console.log("event.target.files", event.target.files);
    const src = "./testfolder";
    const files = event.target.files;

    for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
      //console.log(files[fileIndex]);
      const imgBlob = URL.createObjectURL(files[fileIndex]);
      let blobObj = await fetch(imgBlob).then((r) => r.blob());
      this.blobData.push({
        name: files[fileIndex].name,
        blob: imgBlob,
        blobObj: blobObj,
        dataPath: files[fileIndex].webkitRelativePath,
      });
      //console.log(this.blobData);
      //console.log(files[fileIndex]);
    }

    let data = new FormData();
    for (var i = 0; i < files.length; i++) {
      data.append("file", this.blobData[i].blobObj, {
        filepath: this.blobData[i].dataPath,
      });
    }

    console.log(data);

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
      });

    // recursive.readdirr(src, function (err, dirs, files) {
    //   let data = new FormData();
    //   files.forEach((file) => {
    //     //for each file stream, we need to include the correct relative file path
    //     console.log(file);
    //     data.append(`file`, fs.createReadStream(file), {
    //       filepath: basePathConverter(src, file),
    //     });
    //   });
    // });
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
          onDrop={this.handleDropEvent} //this.handleDropEvent (original)
          onDragOver={(event) => {
            event.preventDefault();
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
