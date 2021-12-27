import React, { Component } from "react";
import IconService from "icon-sdk-js";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import ICONexConnection from "./utils/interact.js";
import { PhotographIcon, XIcon } from "@heroicons/react/solid";
import PreviewComponent from "./PreviewComponent.js";
import axios from "axios";
const { IconConverter, IconBuilder, HttpProvider } = IconService;

export class LaunchComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collectionName: "default",
      nftMintPrice: 0,
      collectionCover: "",
      collectionCoverFile: "",
      isUploaded: false,
      showAdvancedSettings: false,
      selectedDate: "",
      tags: [],
    };
    const provider = new IconService.HttpProvider(
      "https://sejong.net.solidwallet.io/api/v3"
    );

    this.iconService = new IconService(provider);
    this.contractAddress = localStorage.getItem("SELECTED_CONTRACT_ADDRESS");
    this.walletAddress = localStorage.getItem("USER_WALLET_ADDRESS");
    this.pinataKey = localStorage.getItem("PINATA_KEY");
    this.pinataSecret = localStorage.getItem("PINATA_SECRET");
    this.connection = new ICONexConnection();
  }

  handleChange = (tags) => {
    this.setState({ tags: tags });
    //this.setState({ tags: tags });
  };

  componentDidMount() {
    if (this.walletAddress == null) {
      alert("Please connect your wallet.");
      return;
    }
    if (this.contractAddress == null) {
      alert("you need to select a contract to view files");
      window.history.back();
      return;
    }

    document.getElementById("_pageTitle").innerText = this.props.pageTitle;
    if (this.state.collectionCover == "") {
      document.getElementById("dragAndDropPreview").style.display = "none";
    }
  }

  //reflect updates immediately on change
  handleCollectionName = () => {
    this.setState({
      collectionName: document.getElementById("tbCollectionName").value,
    });
  };

  handleMintPrice = (event) => {
    const re = /^[0-9\b]+$/; //test for regex
    if (event.target.value === "" || re.test(event.target.value)) {
      this.setState({ nftMintPrice: event.target.value });
    }
  };

  handleDropFile = (event) => {
    event.preventDefault();
    if (event.dataTransfer.items.length > 1) {
      console.log("not allowed");
      alert("multiple files detected");
      return;
    }
    const imgBlob = URL.createObjectURL(event.dataTransfer.files[0]); //creating a blob url
    console.log(imgBlob);

    document.getElementById("dragAndDropPrompt").style.display = "none";
    document.getElementById("dragAndDropPreview").style.display = "block";
    this.setState({ collectionCover: imgBlob });
    this.setState({ collectionCoverFile: event.dataTransfer.files[0] });
  };

  removeCoverImage = () => {
    document.getElementById("dragAndDropPrompt").style.display = "block";
    document.getElementById("dragAndDropPreview").style.display = "none";
    this.setState({ collectionCover: "" });
  };

  handleDefaults = (event) => {
    event.preventDefault();
  };

  //modal handler
  handleSettingsModal = () => {
    this.setState({ showAdvancedSettings: true });
  };

  hideSettingsModal = () => {
    this.setState({ showAdvancedSettings: false });
  };

  handlePublishDapp = async () => {
    let collectionName = document.getElementById("tbCollectionName").value;
    let mintPrice = parseInt(document.getElementById("tbMintPrice").value);
    let collectionCover = this.state.collectionCover;

    if (
      collectionName.length == 0 ||
      Number.isNaN(mintPrice) ||
      collectionCover.length == 0
    ) {
      alert(
        "required fields should not be null, please make sure collection name, mint price and collection cover has been configured"
      );
      return;
    }

    //set siteInfo
    this.setSiteInfo(collectionName, mintPrice, collectionCover);

    //upload collection cover to pinata
    const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    let response = await this.pinSingleFileToIPFS(
      this.state.collectionCoverFile,
      "collectionCover"
    );

    let collectionCoverHash = response.data.IpfsHash;

    //generate microsite & upload microsite to pinatacloud
    let htmlContent = `
        <!DOCTYPE html>
    <html>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossorigin="anonymous"
        />
        <link
          href="https://gateway.pinata.cloud/ipfs/QmbLteaJBbt4evWx8LY4CFWj1h5DwEP2bcYup8p7iGthVE?filename=app.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <div style="height: 100vh; background-color: #323232">
          <button
            type="button"
            id="btnConnectWallet"
            class="preview-connect-wallet btn btn-primary"
            onclick="handleConnectWallet()"
          >
            Connect Wallet
          </button>
          <div class="preview-container">
            <div class="preview-content">
              <div class="preview-title"><span>${collectionName}</span></div>
              <div class="preview-cover-image">
                <img
                  src="https://gateway.pinata.cloud/ipfs/${collectionCoverHash}"
                  style="background-color: rgb(50, 50, 50); height: 100%"
                />
              </div>
              <div class="preview-price">
                <div style="display: inline-block; width: 100%; text-align: center">
                  <button onclick="handleQuantity('increment')">+</button
                  ><input
                    id="mint_qty"
                    type="number"
                    class="preview-mint-qty unselectable"
                    disabled=""
                    value="1"
                  /><button onclick="handleQuantity('decrement')">-</button>
                </div>
              </div>
              <button
                onclick="mintNft()"
                type="button"
                class="mintButton btn btn-primary"
              >
                Mint - <span id="totalMintCost">${mintPrice}</span> ICX
              </button>
            </div>
          </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/icon-sdk-js@latest/build/icon-sdk-js.web.min.js"></script>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
          crossorigin="anonymous"
        ></script>
        <script>
          var IconService = window["icon-sdk-js"];
          var IconConverter = IconService.Converter;
          let perNftCost = 10;
          let walletAddress;
          const handleQuantity = (eventType) => {
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
          };

          const mintNft = () => {
            if (walletAddress == null) {
              alert("please connect your wallet");
              return;
            }
            let quantityToMint = parseInt(
              document.getElementById("mint_qty").value
            );
            var payload = {
              jsonrpc: "2.0",
              method: "icx_sendTransaction",
              id: 6639,
              params: {
                to: "${this.contractAddress}",
                from: walletAddress,
                nid: "0x53",
                version: IconConverter.toHexNumber("3"),
                value: IconConverter.toHexNumber(
                  quantityToMint * perNftCost * 10 ** 18
                ),
                timestamp: IconConverter.toHexNumber(new Date().getTime() * 1000),
                stepLimit: IconConverter.toHexNumber("2000000"),
                nonce: IconConverter.toHexNumber("1"),
                dataType: "call",
                data: {
                  method: "mint",
                  params: {
                    _mintQuantity: IconConverter.toHexNumber("2"),
                  },
                },
              },
            };

            ICONexRequest("REQUEST_JSON-RPC", payload);
          };

          const handleConnectWallet = async () => {
            let _walletAddress;
            if (walletAddress == null) {
              _walletAddress = await ICONexRequest("REQUEST_ADDRESS");
              document.getElementById("btnConnectWallet").innerText =
                _walletAddress == null || _walletAddress == "undefined"
                  ? "Connect Wallet"
                  : "Disconnect from " + _walletAddress;
            } else {
              document.getElementById("btnConnectWallet").innerText =
                "Connect Wallet";
              _walletAddress = null;
            }
            walletAddress = _walletAddress;
          };

          async function ICONexRequest(requestType, payload) {
            return new Promise((resolve, reject) => {
              function eventHandler(event) {
                const { payload } = event.detail;
                window.removeEventListener("ICONEX_RELAY_RESPONSE", eventHandler);
                resolve(payload);
              }
              window.addEventListener("ICONEX_RELAY_RESPONSE", eventHandler);

              window.dispatchEvent(
                new window.CustomEvent("ICONEX_RELAY_REQUEST", {
                  detail: {
                    type: requestType,
                    payload,
                  },
                })
              );
            });
          }
        </script>
      </body>
    </html>

        `;

    const htmlFile = new File([htmlContent], "dapp.html", {
      type: "text/html",
    });

    let dappResponse = await this.pinSingleFileToIPFS(htmlFile, "dapp");
    console.log(
      `https://gateway.pinata.cloud/ipfs/${dappResponse.data.IpfsHash}`
    );
  };

  pinSingleFileToIPFS = async (fileObj, displayedObjName) => {
    const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    let data = new FormData();
    data.append("file", fileObj);
    const metadata = JSON.stringify({ name: displayedObjName });
    data.append("pinataMetadata", metadata);
    let response = await axios
      .post(pinataEndpoint, data, {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: this.pinataKey,
          pinata_secret_api_key: this.pinataSecret,
        },
      })
      .then((res) => {
        return res;
      }); //will probably have to handle error here
    return response;
  };

  setSiteInfo = async (_collectionTitle, _mintCost, _collectionCover) => {
    const selectedContract = "cxe398f645eb6b891c51fa35ec7b40c19cee18ab8e";
    const txObj = new IconBuilder.CallTransactionBuilder()
      .from(this.walletAddress)
      .to(this.contractAddress)
      .stepLimit(IconConverter.toBigNumber(2000000))
      .nid("0x53")
      .nonce(IconConverter.toBigNumber(1))
      .version(IconConverter.toBigNumber(3)) //constant
      .timestamp(new Date().getTime() * 1000)
      .method("setSiteInfo")
      .params({
        _collectionTitle: _collectionTitle,
        _mintCost: IconConverter.toHex(_mintCost * 10 ** 18),
        _coverImage: _collectionCover,
        _launchDate: IconConverter.toHex(new Date().getTime() * 1000),
      })
      .build();

    console.log("siteInfo", txObj);

    const payload = {
      jsonrpc: "2.0",
      method: "icx_sendTransaction",
      id: 6639,
      params: IconConverter.toRawTransaction(txObj),
    };

    console.log("payload", payload);
    let rpcResponse = await this.connection.getJsonRpc(payload);
  };

  handleSaveOptional = (event) => {
    event.preventDefault();

    let timestamp;
    if (this.state.selectedDate != "" || this.state.selectedDate != null) {
      timestamp = this.state.selectedDate.getTime() * 1000;
    }
    console.log("timestamp", timestamp);
    let whitelistedAddress = document.getElementById(
      "tbWhitelistedAddress"
    ).value; //validate for json
    console.log("whitelisted", whitelistedAddress);
  };

  render() {
    if (this.contractAddress == null) {
      return <div></div>;
    } else {
      return (
        <div style={{ height: "75vh" }}>
          <Container>
            <Row style={{ marginTop: "10px" }}>
              <Col xs={4} md={4} lg={4}>
                <Form.Floating
                  className="mb-3 unselectable"
                  style={{ marginTop: "25px" }}
                >
                  <Form.Control
                    id="tbCollectionName"
                    type="text"
                    placeholder="Collection Name"
                    className="modal-form-control"
                    onChange={this.handleCollectionName}
                  />
                  <label
                    htmlFor="tbCollectionName"
                    style={{ color: "#525252" }}
                  >
                    Collection Name
                  </label>
                </Form.Floating>

                <Form.Floating
                  className="mb-3 unselectable"
                  style={{ marginTop: "25px" }}
                >
                  <Form.Control
                    id="tbMintPrice"
                    type="number"
                    placeholder="Mint Price"
                    className="modal-form-control"
                    onChange={this.handleMintPrice}
                  />
                  <label htmlFor="tbMintPrice" style={{ color: "#525252" }}>
                    Mint Price
                  </label>
                </Form.Floating>

                <Form.Floating
                  className="mb-3 unselectable"
                  style={{ marginTop: "25px" }}
                >
                  <Card
                    className="upload-card unselectable"
                    onDrop={this.handleDropFile}
                    onDragOver={this.handleDefaults}
                    onDragEnter={this.handleDefaults}
                    onDragLeave={this.handleDefaults}
                  >
                    <div
                      id="dragAndDropPrompt"
                      style={{ paddingBottom: "10px" }}
                    >
                      <PhotographIcon
                        style={{ width: "5rem", color: "#494a66" }}
                      />
                      <span
                        style={{
                          display: "block",
                          color: "#494a66",
                          fontSize: "1rem",
                          fontWeight: "500",
                        }}
                      >
                        drag and drop collection cover image
                      </span>
                    </div>
                    <Col
                      id="dragAndDropPreview"
                      xs={2}
                      style={{ marginBottom: "10px" }}
                    >
                      <div style={{ padding: "5px", position: "relative" }}>
                        <img
                          src={this.state.collectionCover}
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
                          onClick={this.removeCoverImage}
                        ></i>
                      </div>
                    </Col>
                  </Card>
                </Form.Floating>

                <Button
                  id="btnPublish"
                  className="modal-form-submit"
                  style={{ marginTop: "5px", padding: "0.5rem" }}
                  onClick={this.handlePublishDapp}
                >
                  publish
                </Button>
                <Button
                  id="btnAdvancedSetting"
                  onClick={this.handleSettingsModal}
                >
                  show optional features
                </Button>
              </Col>
              <Col xs={8} md={8} lg={8}>
                <PreviewComponent previewData={this.state} />
              </Col>
            </Row>
          </Container>
          <Modal show={this.state.showAdvancedSettings}>
            <div className="advanced-settings-modal">
              <span className="modal-title">Advanced Settings</span>
              <XIcon className="close-modal" onClick={this.hideSettingsModal} />
              <Form.Floating style={{ marginTop: "10px" }}>
                <DatePicker
                  timeInputLabel="Time:"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  showTimeInput
                  className="modal-form-control"
                  placeholderText="Launch Date - optional"
                  selected={this.state.selectedDate}
                  minDate={new Date()}
                  onChange={(date) => this.setState({ selectedDate: date })}
                />
              </Form.Floating>

              <Form.Floating
                className="mb-3 unselectable"
                style={{ marginTop: "25px" }}
              >
                <Form.Control
                  as="textarea"
                  className="modal-form-control"
                  id="tbWhitelistedAddress"
                  rows={3}
                  style={{ height: "100%" }}
                />
                <label
                  htmlFor="tbWhitelistedAddress"
                  style={{ color: "#525252" }}
                >
                  Whitelisted Address - optional
                </label>
              </Form.Floating>

              <TagsInput value={this.state.tags} onChange={this.handleChange} />
              <Button
                id="btnSave"
                className="modal-form-submit"
                style={{ padding: "0.5rem", marginBottom: "3px" }}
                onClick={this.handleSaveOptional}
              >
                save
              </Button>
            </div>
          </Modal>
        </div>
      );
    }
  }
}

export default LaunchComponent;
