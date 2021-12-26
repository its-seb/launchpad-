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
import "./style.css";

class PreviewComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collectionName: this.props.previewData.collectionName,
      nftMintPrice: this.props.previewData.nftMintPrice,
      collectionCover: this.props.previewData.collectionCover,
      totalCost: 0,
    };
  }

  componentDidMount() {
    console.log(this.state.collectionCover);
  }

  componentWillReceiveProps(props) {
    let inputElement = document.getElementById("mint_qty");
    this.setState({
      collectionName: props.previewData.collectionName,
      nftMintPrice: props.previewData.nftMintPrice,
      collectionCover: props.previewData.collectionCover,
      totalCost: inputElement.value * props.previewData.nftMintPrice,
    });
  }

  handleQuantity = (eventType) => {
    let inputElement = document.getElementById("mint_qty");
    let inputValue = parseInt(inputElement.value);
    if (eventType == "increment") {
      let max = 100;
      inputElement.value = inputValue == max ? max : inputValue + 1;
    } //decrement
    else {
      let min = 1;
      inputElement.value = inputValue == min ? min : inputValue - 1;
    }
    this.setState({ totalCost: inputElement.value * this.state.nftMintPrice });
  };

  render() {
    return (
      <>
        <Card className="preview-card unselectable">
          <Button className="preview-connect-wallet">Connect Wallet</Button>
          <div className="preview-container">
            <div className="preview-content">
              <div className="preview-title">
                <span>{this.state.collectionName}</span>
              </div>
              <div className="preview-cover-image">
                <Image
                  src={this.state.collectionCover}
                  style={{
                    backgroundColor: "#323232",
                    height: "100%",
                  }}
                ></Image>
              </div>
              <div className="preview-price">
                <div
                  style={{
                    display: "inline-block",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <button onClick={() => this.handleQuantity("decrement")}>
                    -
                  </button>
                  <input
                    id="mint_qty"
                    type="number"
                    className="preview-mint-qty unselectable"
                    readOnly
                    disabled
                    defaultValue="1"
                  ></input>
                  <button onClick={() => this.handleQuantity("increment")}>
                    +
                  </button>
                </div>
              </div>
              <Button
                style={{
                  marginTop: "15px",
                  float: "right",
                  backgroundColor: "#323232",
                  width: "100%",
                  padding: "10px",
                  fontWeight: "500",
                }}
              >
                Mint - {this.state.totalCost} ICX
              </Button>
            </div>
          </div>
        </Card>
      </>
    );
  }
}

export default PreviewComponent;
