import React, { Component } from "react";
import { Col, Row, Button } from "react-bootstrap";
import "./global.css";

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

  handleDropEvent = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
      console.log(files[fileIndex]);
      const imgBlob = URL.createObjectURL(files[fileIndex]);
      this.blobData.push({ name: files[fileIndex].name, blob: imgBlob });
      console.log(this.blobData);
    }
    this.setState({ file: this.blobData });
  };

  //to do later; drag and drop for now
  handleBrowseFiles = (event) => {
    //this.fileUploader.click();
    event.preventDefault();
  };

  handleUploadFiles = () => {
    if (this.blobData.length == 0) {
      alert("no files found, please upload file");
    }
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
          onDrop={this.handleDropEvent}
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onClick={this.handleBrowseFiles}
        >
          <span style={{ color: "#5d2985" }}>drag & drop files</span>
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
          multiple
          accept="image/png, image/jpeg"
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
