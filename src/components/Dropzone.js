import IconService from "icon-sdk-js";
import "./app_content.css";
import React, { Component } from "react";
import ICONexConnection, { sleep } from "./utils/interact.js";
import Dexie from "dexie";
import Compressor from "compressorjs";
import { Navigate } from "react-router-dom";
import {
  Switch,
  Text,
  SimpleGrid,
  Box,
  VisuallyHiddenInput,
  Button,
  Image,
  CloseButton,
  Spinner,
} from "@chakra-ui/react";
import FailureComponent from "./FailureComponent.js";
import SuccessComponent from "./SuccessComponent.js";
import {
  PhotographIcon,
  DocumentTextIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import "./global.css";
import "./style.css";
const axios = require("axios");
const { IconConverter, IconBuilder } = IconService;

class Dropzone extends Component {
  uploadedFiles = [];
  uploadedJsonFiles = [];
  constructor(props) {
    super(props);
    this.state = {
      file: this.uploadedFiles,
      metadataJson: this.uploadedJsonFiles,
      // pinataAuthenticated: "hello",
      pinningImageProgress: 0,
      generatingJsonProgress: 0,
      pinningJsonProgress: 0,
      totalProgress: 0,
      show: false,
      uploadMessage: "",
      complete: false,
      redirect: false,
      showMetadataSection: false,
      showStatusModal: false,
      statusTitle: "",
      statusText: "",
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

    this.imagesUploadInput = React.createRef();
    this.metadataUploadInput = React.createRef();
    this.statusModal = React.createRef();
    this.statusSuccess = React.createRef();
    this.statusFail = React.createRef();
    this.statusLoading = React.createRef();
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
    return result;
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

  handleImagesOnChange = async (e) => {
    e.preventDefault();
    console.log(e.target.files);
    const files = e.target.files;
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
  };

  handleMetadataOnChange = async (e) => {
    e.preventDefault();
    const files = e.target.files;

    for (var i = 0; i < files.length; i++) {
      let fileData = await files[i].text();
      let metadata = JSON.parse(fileData);
      this.uploadedJsonFiles.push(metadata);
    }
    this.setState({ metadataJson: this.uploadedJsonFiles });
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
  }

  remove_json(file_index) {
    let updated_uploadedJsonFiles = [];
    for (let i = 0; i < this.uploadedJsonFiles.length; i++) {
      if (i != file_index.i) {
        updated_uploadedJsonFiles.push(this.uploadedJsonFiles[i]);
      }
    }
    this.uploadedJsonFiles = updated_uploadedJsonFiles;
    this.setState({ metadataJson: this.uploadedJsonFiles });
  }

  handleUploadFiles = async () => {
    //display status modal
    this.statusModal.current.style.display = "block";

    if (this.uploadedFiles.length == 0) {
      this.statusLoading.current.style.display = "none";
      this.statusFail.current.style.display = "block";
      this.setState({ statusTitle: "Oops..." });
      this.setState({
        statusText: "Make sure you have uploaded the files",
      });
      return;
    }

    //check if number of files uploaded matches,
    //assumption here is user uploads unique files (uniquelynamed*)
    if (this.state.showMetadataSection) {
      if (this.uploadedFiles.length != this.uploadedJsonFiles.length) {
        this.statusLoading.current.style.display = "none";
        this.statusFail.current.style.display = "block";
        this.setState({ statusTitle: "Oops..." });
        this.setState({
          statusText: "Make sure each file is associated with metadata json",
        });
        return;
      }
    }

    //step 1 - generate form data for original resolution image & compressed image (for thumbnail)
    this.setState({ statusText: "pinning image files to pinata..." });
    let originalData = this.createOriginalImageFormData(this.uploadedFiles);
    let thumbnailData = this.createThumbnailImageFormData(this.uploadedFiles);

    console.log("original data", originalData);
    console.log("thumbnailData", thumbnailData);
    console.log(originalData);
    console.log(thumbnailData);

    //step 2 - pin files to IPFS
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

    //step 3 - generate metadata json file
    this.setState({ statusText: "pinning metadata to pinata..." });

    let [originalCombinedJson, originalJsonData] = this.createJsonFormData(
      this.uploadedFiles,
      originalResponse.data.IpfsHash,
      "original_json"
    );
    let [thumbnailCombinedJson, thumbnailJsonData] = this.createJsonFormData(
      this.uploadedFiles,
      thumbnailResponse.data.IpfsHash,
      "thumbnail_json"
    );

    console.log("original combined Json", originalCombinedJson);
    console.log("originalJsonData", originalJsonData);
    console.log("thumbnailCombinedJson", thumbnailCombinedJson);
    console.log("thumbnailJsonData", thumbnailJsonData);

    // step 4 - pin json to ipfs
    let combjson_originalResponse = await this.pinJsonToIPFS(
      originalCombinedJson,
      "combined_org_json"
    );
    let combjson_thumbnailResponse = await this.pinJsonToIPFS(
      thumbnailCombinedJson,
      "combined_thumbnail_json"
    );

    console.log("combined josn_original res", combjson_originalResponse);
    console.log("combined josn_thumbnail res", combjson_thumbnailResponse);

    let metadata_response = await this.pinMultipleFilesToIPFS(
      originalJsonData,
      "json_metadata"
    );
    console.log("metadata_response", metadata_response);

    //update contract
    this.setState({ statusText: "updating smart contract..." });
    await this.set_totalandcurrent_supply(
      this.uploadedFiles.length,
      metadata_response.data.IpfsHash,
      combjson_originalResponse,
      combjson_thumbnailResponse
    ).then(() => {
      this.db.contracts.update(this.contractAddress, {
        metahash_exist: true,
      });
      localStorage.setItem("HAS_METAHASH", true);
      this.statusLoading.current.style.display = "none";
      this.statusSuccess.current.style.display = "block";
      this.setState({ statusText: "files uploaded successfully!" });
    });

    await sleep(1000);
    this.setState({ statusText: "redirecting to launchpage..." });

    await sleep(1500);
    this.setState({ redirect: true });
    // };
  };

  // Create Form
  createThumbnailImageFormData = (files) => {
    let thumbnailData = new FormData();
    for (var i = 0; i < files.length; i++) {
      console.log("createThumbnailImageFormData", files[i].name);
      //For Compressed File

      let x = new Compressor(files[i].dataFile, {
        quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
        convertSize: Infinity,
        success: (compressedResult) => {
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.
          console.log(compressedResult);
          thumbnailData.append(
            `file`,
            compressedResult,
            `file/${compressedResult.name}`
          );
        },
      });
    }
    console.log(thumbnailData);
    return thumbnailData;
  };

  createOriginalImageFormData = (files) => {
    let originalData = new FormData();
    for (var i = 0; i < files.length; i++) {
      console.log("createOriginalImageFormData", files[i]);
      //For original full Resolution File
      originalData.append(`file`, files[i].dataFile, `file/${files[i].name}`);
    }
    return originalData;
  };

  createJsonFormData = (files, ipfsHash) => {
    let combinedJson = { files_link: [] };
    const ipfsFolderHash = `https://launchpad.mypinata.cloud/ipfs/${ipfsHash}`; //gateway might change so its stored as ipfs:// ; opensea decides gateway
    let data = new FormData();

    for (var i = 0; i < files.length; i++) {
      combinedJson.files_link.push({
        link: `${ipfsFolderHash}/${files[i].name}`,
        name: `${files[i].name}`,
      });

      let individualJson = {};
      if (this.state.showMetadataSection == true) {
        console.log("showmetadata", this.uploadedJsonFiles[i]);
        console.log("showmetadataimage", this.uploadedJsonFiles[i].image);
        this.uploadedJsonFiles[
          i
        ].image = `${ipfsFolderHash}/${this.uploadedJsonFiles[i].image}`;
        individualJson = this.uploadedJsonFiles[i];
      } else {
        individualJson = {
          image: `${ipfsFolderHash}/${this.uploadedFiles[i].name}`,
        };
      }

      const jsonFile = new File([JSON.stringify(individualJson)], `${i}.json`, {
        type: "application/json",
      });
      data.append(`file`, jsonFile, `data/${i}.json`);
    }
    return [combinedJson, data];
  };

  //pinning function
  pinJsonToIPFS = async (content, displayedObjName) => {
    const pinataEndpoint = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
    const data = {
      pinataMetadata: { name: displayedObjName },
      pinataContent: content,
    };
    let response = await axios
      .post(pinataEndpoint, data, {
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

  closeStatusModal = () => {
    this.statusSuccess.current.style.display = "none";
    this.statusFail.current.style.display = "none";
    this.statusModal.current.style.display = "none";
    this.statusLoading.current.style.display = "block";
    this.setState({ statusTitle: "" });
    this.setState({ statusText: "" });
  };

  render() {
    return (
      <>
        <SimpleGrid columns={1} spacing={"1rem"} mt="1rem">
          <Box minHeight="60vh" h="100%" px={[0, 50, 150, 250]} pb="1.5rem">
            <Text layerStyle="section_title">Upload Files</Text>
            <Box
              border="2px solid #949494"
              borderRadius={"xl"}
              mt="1rem"
              p="2rem"
              textAlign="right"
              _hover={
                this.uploadedFiles.length == 0
                  ? { backgroundColor: "#2f3136", cursor: "pointer" }
                  : null
              }
              onClick={() => {
                if (this.uploadedFiles.length == 0) {
                  this.imagesUploadInput.current.click();
                }
              }}
            >
              <Box display={this.uploadedFiles.length > 0 ? "none" : "block"}>
                <PhotographIcon
                  color="white"
                  width="3rem"
                  className="m-auto"
                  mt="1rem"
                />
                <Text lineHeight="" color="white" textAlign="center">
                  File types supported: JPG, PNG, GIF
                </Text>
              </Box>

              <VisuallyHiddenInput
                type="file"
                ref={this.imagesUploadInput}
                accept="image/png, image/jpeg, image/gif"
                onChange={(e) => this.handleImagesOnChange(e)}
                multiple={true}
              ></VisuallyHiddenInput>
              <SimpleGrid columns={5} spacingX="1rem" spacingY="3rem">
                {(this.uploadedFiles || []).map((data, i) => (
                  <Box
                    h="100px"
                    w="100px"
                    m="auto"
                    bg="#595A5A"
                    borderRadius="10"
                    textAlign="right"
                    position="relative"
                  >
                    <Image
                      src={data.blob}
                      maxHeight={100}
                      maxWidth={100}
                      p={3}
                    ></Image>
                    <XCircleIcon
                      className="remove_image"
                      onClick={(e) => this.remove_file({ i })}
                    ></XCircleIcon>
                    <Text
                      layerStyle="card_content"
                      textAlign="center"
                      color="white"
                      mt={1}
                    >
                      {data.name}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
              {this.uploadedFiles.length > 0 ? (
                <Button
                  mt="10"
                  onClick={() => this.imagesUploadInput.current.click()}
                  variant="modal_submit"
                >
                  Add Files
                </Button>
              ) : null}
            </Box>

            <Text layerStyle="section_title" mt="1rem">
              Existing Metadata File
              <Switch
                float="right"
                colorScheme="brand"
                onChange={(e) =>
                  this.setState({ showMetadataSection: e.target.checked })
                }
              />
            </Text>
            <Text color="white">
              Toggle this option if you have existing metadata file
            </Text>
            <Text
              layerStyle="section_title"
              mt="1rem"
              display={this.state.showMetadataSection ? "block" : "none"}
            >
              Upload Metadata File
            </Text>
            <Box
              border="2px solid #949494"
              borderRadius={"xl"}
              mt="1rem"
              p="2rem"
              textAlign="right"
              _hover={{ backgroundColor: "#2f3136", cursor: "pointer" }}
              display={this.state.showMetadataSection ? "block" : "none"}
              _hover={
                this.state.metadataJson.length == 0
                  ? { backgroundColor: "#2f3136", cursor: "pointer" }
                  : null
              }
              onClick={() => {
                if (this.state.metadataJson.length == 0) {
                  this.metadataUploadInput.current.click();
                }
              }}
            >
              {console.log(
                "this.state.metadataJson",
                this.state.metadataJson.length
              )}
              <Box
                display={this.uploadedJsonFiles.length > 0 ? "none" : "block"}
              >
                <DocumentTextIcon
                  color="white"
                  width="3rem"
                  className="m-auto"
                  mt="1rem"
                />
                <Text color="white" textAlign="center">
                  File type supported: JSON
                </Text>
              </Box>
              <VisuallyHiddenInput
                type="file"
                ref={this.metadataUploadInput}
                accept="application/json"
                onChange={(e) => this.handleMetadataOnChange(e)}
                multiple={true}
              ></VisuallyHiddenInput>
              <SimpleGrid columns={5} spacingX="1rem" spacingY="3rem">
                {(this.uploadedJsonFiles || []).map((data, i) => (
                  <Box
                    h="100px"
                    w="100px"
                    m="auto"
                    bg="#595A5A"
                    borderRadius="10"
                    textAlign="right"
                    position="relative"
                  >
                    <DocumentTextIcon
                      color="white"
                      style={{ padding: "1rem" }}
                    ></DocumentTextIcon>
                    <XCircleIcon
                      className="remove_image"
                      onClick={(e) => this.remove_json({ i })}
                    ></XCircleIcon>
                    <Text
                      layerStyle="card_content"
                      textAlign="center"
                      color="white"
                      mt={1}
                    >
                      {data.name}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
              {this.uploadedJsonFiles.length > 0 ? (
                <Button
                  mt="10"
                  onClick={() => this.metadataUploadInput.current.click()}
                  variant="modal_submit"
                >
                  Add Files
                </Button>
              ) : null}
            </Box>
            <Button
              variant="modal_submit"
              float="right"
              mt={5}
              onClick={this.handleUploadFiles}
            >
              Upload to IPFS
            </Button>
          </Box>
        </SimpleGrid>

        <Box
          id="statusModal"
          layerStyle="modal_container"
          ref={this.statusModal}
        >
          <Box layerStyle="modal_content" alignItems="center">
            <CloseButton
              position="absolute"
              right={3}
              top={3}
              onClick={this.closeStatusModal}
            />
            <Spinner
              variant="loading_spinner"
              thickness="4px"
              speed="0.65s"
              ref={this.statusLoading}
            ></Spinner>
            <SuccessComponent _ref={this.statusSuccess} _show="none" />
            <FailureComponent _ref={this.statusFail} _show="none" />

            <Text layerStyle="modal_title">{this.state.statusTitle}</Text>
            <Text layerStyle="modal_text">{this.state.statusText}</Text>
          </Box>
        </Box>

        {this.renderRedirect()}
      </>
    );
  }
}

export default Dropzone;
