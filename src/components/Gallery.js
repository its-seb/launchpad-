import IconService from "icon-sdk-js";
// import "./app_content.css";
// import React, { Component } from "react";
// import "./global.css";
// import "./style.css";
import React, { Component } from "react";
import {
  Image,
  Grid,
  GridItem,
  Flex,
  Button,
  Box,
  Text,
  Select,
  Center,
  HStack,
  ButtonGroup,
  SimpleGrid,
  Link,
} from "@chakra-ui/react";
import { Scrollbar } from "smooth-scrollbar-react";
import ICONexConnection from "./utils/interact.js";
const axios = require("axios");
const { IconBuilder } = IconService;

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metahash: this.props.metahash,
      uploadedFiles: [],
      thumbnailFiles: [],
    };
    const provider = new IconService.HttpProvider(
      "https://sejong.net.solidwallet.io/api/v3"
    );
    this.jsonhash = "";
    this.jsonthumbnailhash = "";
    this.iconService = new IconService(provider);
    this.contractAddress = localStorage.getItem("SELECTED_CONTRACT_ADDRESS");
    this.mintedLink = [];
    this.gateway = "launchpad.mypinata.cloud";
  }
  getJSONFileMetahash = async (contractAddress) => {
    const callObj = new IconBuilder.CallBuilder()
      .from(null)
      .to(contractAddress)
      .method("getJSONFileMetahash")
      .build();

    let result = await this.iconService
      .call(callObj)
      .execute()
      .then((response) => {
        console.log("getJSONFileMetahash", response);
        return response;
        //this.jsonhash = response;
      })
      .catch((error) => {
        console.log("getJSONFileMetahasherror", error);
        Promise.resolve({ error });
      });
    return result;
  };

  getJSONThumbnailMetahash = async (contractAddress) => {
    const callObj = new IconBuilder.CallBuilder()
      .from(null)
      .to(contractAddress)
      .method("getJSONThumbnailMetahash")
      .build();

    let result = await this.iconService
      .call(callObj)
      .execute()
      .then((response) => {
        console.log("getJSONThumbnailMetahash", response);
        return response;
      })
      .catch((error) => {
        console.log("getJSONThumbnailMetahash", error);
        Promise.resolve({ error });
      });
    return result;
  };

  async componentDidMount() {
    console.log("component did mount", this.contractAddress);
    let jsonFileMetahash = await this.getJSONFileMetahash(this.contractAddress);
    let jsonThumbnailMetahash = await this.getJSONThumbnailMetahash(
      this.contractAddress
    );

    const fileURL = `https://launchpad.mypinata.cloud/ipfs/${jsonFileMetahash}`;
    const thumbnailURL = `https://launchpad.mypinata.cloud/ipfs/${jsonThumbnailMetahash}`;

    console.log("line 99", fileURL, thumbnailURL);

    let json_upload_response = await axios
      .get(fileURL)
      .then((response) => {
        this.setState({ uploadedFiles: response.data.files_link });
      })
      .catch((error) => {
        console.log(error);
      });

    if (this.state.uploadedFiles[0].name.endsWith(".gif")) {
      this.setState({ thumbnailFiles: this.state.uploadedFiles });
    } else {
      let json_upload_response2 = await axios
        .get(thumbnailURL)
        .then((response) => {
          console.log(response);
          this.setState({ thumbnailFiles: response.data.files_link });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  render() {
    console.log("this state", this.state.thumbnailFiles);
    return (
      <SimpleGrid
        columns={4}
        overflow={"auto"}
        marginRight={"auto"}
        marginLeft={"auto"}
        columns={4}
        spacing="5"
        p="10"
      >
        {this.state.thumbnailFiles.map((data, index) => (
          <Box>
            <Link target="_blank" href={this.state.uploadedFiles[index].link}>
              <Image
                src={"https://" + this.gateway + data.link.slice(32)}
                width={"100%"}
                boxShadow="md"
                rounded="md"
              />
              <Text
                layerStyle="card_content"
                textAlign="center"
                color="white"
                mt={1}
              >
                {data.name}
              </Text>
            </Link>
          </Box>
        ))}
      </SimpleGrid>
    );
  }
}

export default Gallery;
