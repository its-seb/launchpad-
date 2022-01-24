import React, { Component } from "react";
import IconService from "icon-sdk-js";
import {
  Box,
  Stack,
  Link,
  Grid,
  GridItem,
  Input,
  FormControl,
  FormLabel,
  Button,
  VisuallyHiddenInput,
  Text,
} from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Link as RouteLink,
} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TagsInput from "react-tagsinput";
import "./style.css";
import ICONexConnection, { sleep } from "./utils/interact.js";
import { PhotographIcon, XIcon } from "@heroicons/react/solid";
import PreviewComponent from "./PreviewComponent.js";
import FailureComponent from "./FailureComponent.js";
import SuccessComponent from "./SuccessComponent.js";
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
      selectedDate: null,
      tags: [],
      modalStatusText: "publishing launch site...",
      showLoadingModal: false,
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
    this.hasMetahash = localStorage.getItem("HAS_METAHASH");

    //
    this.tbCollectionName = React.createRef();
    this.tbMintPrice = React.createRef();
    this.coverImageUploadInput = React.createRef();
  }

  handleChange = (tags) => {
    this.setState({ tags: tags });
  };

  executeCall = async (contractAddress, method) => {
    const callObj = new IconBuilder.CallBuilder()
      .from(null)
      .to(this.contractAddress)
      .method(method)
      .build();

    console.log(callObj);

    let result = await this.iconService
      .call(callObj)
      .execute()
      .then((response) => {
        console.log("then response", response);
        return response;
      })
      .catch((error) => {
        console.log("catch error", error);
        Promise.resolve({ error });
      });
    return result;
  };

  async componentDidMount() {
    if (this.walletAddress == null) {
      alert("Please connect your wallet.");
      return;
    }
    if (this.contractAddress == null) {
      alert("you need to select a contract to generate launch site");
      return;
    }

    if (this.hasMetahash != "false") {
      if (this.state.collectionCover == "") {
        //document.getElementById("dragAndDropPreview").style.display = "none";
      }
    } else {
      alert("please upload files before generating launch site");
      return;
    }

    let response = await this.executeCall(this.contractAddress, "getSiteInfo");
    if (Object.keys(response).length != 0) {
      //site info set
      // document.getElementById("tbCollectionName").value =
      //   response.collectionTitle;

      let _nftMintPrice = IconConverter.toNumber(response.mintCost / 10 ** 18);
      // document.getElementById("tbMintPrice").value = _nftMintPrice;

      this.setState({
        collectionCover: response.coverImage,
        collectionName: response.collectionTitle,
        nftMintPrice: _nftMintPrice,
      });
    }

    //setState({tags: tags})
    //getSiteInfo
  }

  async componentWillReceiveProps(props) {
    let response = await this.executeCall(this.contractAddress, "getSiteInfo");
    if (Object.keys(response).length != 0) {
      //site info set
      document.getElementById("tbCollectionName").value =
        response.collectionTitle;

      let _nftMintPrice = IconConverter.toNumber(response.mintCost) / 10 ** 18;
      document.getElementById("tbMintPrice").value = _nftMintPrice;
      this.setState({
        collectionCover: response.coverImage,
        collectionName: response.collectionTitle,
        nftMintPrice: _nftMintPrice,
      });
    }
  }

  //reflect updates immediately on change
  handleCollectionName = () => {
    this.setState({
      collectionName: this.tbCollectionName.current.value,
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

    // document.getElementById("dragAndDropPrompt").style.display = "none";
    // document.getElementById("dragAndDropPreview").style.display = "block";
    this.setState({ collectionCover: imgBlob });
    this.setState({ collectionCoverFile: event.dataTransfer.files[0] });
  };

  removeCoverImage = () => {
    // document.getElementById("dragAndDropPrompt").style.display = "block";
    // document.getElementById("dragAndDropPreview").style.display = "none";
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

    this.setState({ showLoadingModal: true });

    //upload collection cover to pinata
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
      href="https://gateway.pinata.cloud/ipfs/QmeqQqq7GLgaEr8cPcsqxRCe6ZyhoEc3AtPMqjyvoqsYoM?filename=app.css"
      rel="stylesheet"
    />
    <style>
      .swal2-styled.swal2-confirm {
        background-color: #424242;
      }
    </style>
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
              style="
                background-color: white;
                width: 100%;
                height: 100%;
              "
            />
          </div>
          <div class="preview-price">
            <div style="display: inline-block; width: 100%; text-align: center">
              <button onclick="handleQuantity('decrement')">-</button
              ><input
                id="mint_qty"
                type="number"
                class="preview-mint-qty unselectable"
                disabled=""
                value="1"
              /><button onclick="handleQuantity('increment')">+</button>
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
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
      var IconService = window["icon-sdk-js"];
      var IconConverter = IconService.Converter;
      let perNftCost = ${mintPrice};
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
        document.getElementById("totalMintCost").innerText =
          inputElement.value * perNftCost;
      };

      const mintNft = async () => {
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
                _mintQuantity: IconConverter.toHexNumber(quantityToMint),
              },
            },
          },
        };

        await ICONexRequest("REQUEST_JSON-RPC", payload).then((res) => {
          Swal.fire({
            title: "Success!",
            text: "You have minted " + quantityToMint + " NFTs from hello4",
            confirmButtonText: "View Wallet",
            icon: "success",
          }).then((result) => {
            window.open(
              "http://localhost:3000/Usergallery/?collection=${this.contractAddress}&title=${collectionName}&user=" + walletAddress,
              "_blank"
            );
          });
        });
      };

      const handleConnectWallet = async () => {
        let _walletAddress;
        if (walletAddress == null) {
          _walletAddress = await ICONexRequest("REQUEST_ADDRESS").then(
            (res) => {
              Swal.fire({
                title: "Connected!",
                icon: "success",
                showCloseButton: true,
                showConfirmButton: false,
                timer: 1500,
              });
              return res;
            }
          );
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
    let publishedDapp = `https://gateway.pinata.cloud/ipfs/${dappResponse.data.IpfsHash}`;
    console.log(publishedDapp);

    this.setState({ modalStatusText: "updating score..." });
    //set siteInfo
    await this.executeCallTransaction(
      this.walletAddress,
      this.contractAddress,
      "setSiteInfo",
      {
        _collectionTitle: collectionName,
        _mintCost: IconConverter.toHex(mintPrice),
        _coverImage: `https://gateway.pinata.cloud/ipfs/${collectionCoverHash}`,
      }
    ).then(async () => {
      // document.getElementById("publishLoading").style.display = "none";
      // document.getElementById("publishSuccess").style.display = "block";
      // document.getElementById("close-loading-modal").style.display = "block";
      this.setState({
        modalStatusText: "launch site published successfully!",
      });
      await sleep(1500);
      window.open(publishedDapp, "_blank");
    });
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

  executeCallTransaction = async (
    walletAddress,
    contractAddress,
    method,
    params
  ) => {
    const txObj = new IconBuilder.CallTransactionBuilder()
      .from(walletAddress)
      .to(contractAddress)
      .stepLimit(IconConverter.toBigNumber(2000000))
      .nid("0x53")
      .nonce(IconConverter.toBigNumber(1))
      .version(IconConverter.toBigNumber(3)) //constant
      .timestamp(new Date().getTime() * 1000)
      .method(method)
      .params(params)
      .build();

    console.log("txObj", txObj);

    const payload = {
      jsonrpc: "2.0",
      method: "icx_sendTransaction",
      id: 6639,
      params: IconConverter.toRawTransaction(txObj),
    };

    console.log("payload", payload);
    let rpcResponse = await this.connection.getJsonRpc(payload).then((res) => {
      return res;
    });
    return rpcResponse;
  };

  handleSaveOptional = async (event) => {
    event.preventDefault();

    //get launch date time
    let timestamp =
      this.state.selectedDate == null
        ? Date.now()
        : new Date(this.state.selectedDate).getTime();
    timestamp = timestamp * 1000;

    let whitelistedAddress = this.state.tags;
    if (this.state.tags.length == 0) {
      whitelistedAddress = [this.walletAddress];
    }

    //get whitelisted address
    let rpcResponse = await this.executeCallTransaction(
      this.walletAddress,
      this.contractAddress,
      "setOptionalSetting",
      {
        _launchDate: IconConverter.toHex(timestamp),
        _whitelistedAddress: whitelistedAddress,
      }
    ).then(() => {
      console.log("completed");
    });
  };

  pasteSplit(data) {
    const separators = [
      ",",
      ";",
      "\\(",
      "\\)",
      "\\*",
      "/",
      ":",
      "\\?",
      "\n",
      "\r",
    ];
    return data.split(new RegExp(separators.join("|"))).map((d) => d.trim());
  }

  coverImageOnChange = (e) => {};

  render() {
    console.log("state", typeof this.hasMetahash);
    if (this.contractAddress == null || this.hasMetahash == "false") {
      return <div></div>;
    } else {
      return (
        <>
          <Stack flexDirection="row">
            <Box mt="1rem">
              <Link as={RouteLink} variant="notCurrent" to="/collection">
                Collection
              </Link>
              <Link variant="notCurrent" href="/file">
                File
              </Link>
              <Link variant="current" href="/launch">
                Launch
              </Link>
            </Box>
          </Stack>
          <Grid
            h="75vh"
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(6, 1fr)"
            gap={4}
            mt="1rem"
          >
            <GridItem rowSpan={2} colSpan={2}>
              <FormControl>
                <Input
                  ref={this.tbCollectionName}
                  bg="#373737"
                  color="white"
                  focusBorderColor="#373737"
                  borderColor="#373737"
                  _hover={{ borderColor: "#373737" }}
                  placeholder="Collection Name"
                  onChange={this.handleCollectionName}
                />
              </FormControl>
              <FormControl mt={4}>
                <Input
                  ref={this.tbMintPrice}
                  bg="#373737"
                  color="white"
                  type="number"
                  focusBorderColor="#373737"
                  borderColor="#373737"
                  _hover={{ borderColor: "#373737" }}
                  placeholder="Mint Price"
                  onChange={this.handleMintPrice}
                />
              </FormControl>
              <Box
                border="2px solid #949494"
                borderRadius={"xl"}
                mt="1rem"
                p="2rem"
                _hover={{ backgroundColor: "#2f3136", cursor: "pointer" }}
                onClick={() => this.coverImageUploadInput.current.click()}
              >
                <PhotographIcon
                  color="white"
                  width="3rem"
                  className="m-auto"
                  mt="1rem"
                />
                <Text color="white" textAlign="center">
                  File type supported: JPG, PNG, GIF
                </Text>
                <VisuallyHiddenInput
                  type="file"
                  ref={this.coverImageUploadInput}
                  accept="image/png, image/jpeg, image/gif"
                  onChange={(e) => this.coverImageOnChange(e)}
                ></VisuallyHiddenInput>
              </Box>
              <Button variant="modal_cancel" mt={5}>
                Optional Settings
              </Button>
              <Button
                variant="modal_submit"
                float="right"
                mt={5}
                onClick={console.log("hello")}
              >
                Publish to IPFS
              </Button>
            </GridItem>
            <GridItem rowSpan={2} colSpan={4} bg="tomato">
              <Box>
                <FormControl>Hello</FormControl>
              </Box>
            </GridItem>
          </Grid>
        </>
      );
    }
  }
}

export default LaunchComponent;
