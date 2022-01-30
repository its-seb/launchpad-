import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Box, Text, Input, Image } from "@chakra-ui/react";
import "./style.css";

class PreviewComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collectionName: this.props.previewData.collectionName,
      nftMintPrice: this.props.previewData.nftMintPrice,
      collectionCover: this.props.previewData.collectionCover,
      totalCost: this.props.previewData.nftMintPrice,
    };
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
        <Box height="100%" maxHeight="100%" position="relative">
          <Button className="preview-connect-wallet">Connect Wallet</Button>
          <Box className="preview-container">
            <Box className="preview-content">
              <Box className="preview-title">
                <Text as="span">{this.state.collectionName}</Text>
              </Box>
              <Box className="preview-cover-image">
                <Image
                  src={this.state.collectionCover}
                  bg="white"
                  h="8rem"
                  m="auto"
                ></Image>
              </Box>
              <Box className="preview-price">
                <Box
                  style={{
                    display: "inline-block",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Box
                    as="button"
                    onClick={() => this.handleQuantity("decrement")}
                  >
                    -
                  </Box>
                  <Input
                    id="mint_qty"
                    type="number"
                    className="preview-mint-qty unselectable"
                    readOnly
                    disabled
                    defaultValue="1"
                  ></Input>
                  <Box
                    as="button"
                    onClick={() => this.handleQuantity("increment")}
                  >
                    +
                  </Box>
                </Box>
              </Box>
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
            </Box>
          </Box>
        </Box>
      </>
    );
  }
}

export default PreviewComponent;
