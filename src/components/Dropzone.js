import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import "./global.css";

class Dropzone extends Component {
  blobData = [];
  constructor(props) {
    super(props);
    this.state = {
      file: this.blobData,
    };
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

  handleBrowseFiles = (event) => {
    //  console.log(fileUploader.current);
    // fileUploader.current.click();
    event.preventDefault();
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

          <div id="gallery" style={{ paddingTop: "25px" }}>
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
                      }}
                    ></img>
                    <span>{data.name} </span>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
        <input
          type="file"
          id="files"
          style={{ display: "none" }}
          multiple
          accept="image/png, image/jpeg"
        ></input>
      </>
    );
  }
}

export default Dropzone;
