import React, { Component } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Box,
  Flex,
  Text,
  SimpleGrid,
  Link,
} from "@chakra-ui/react";
import IconService from "icon-sdk-js";
import "./style.css";
const axios = require("axios");
const { IconBuilder } = IconService;

export default class Usergallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mintedNFT: [],
      NFTName: [],
      thumbnailFiles: [],
      showAdvancedSettings: false,
      modaltitle: "modal title",
      modalpicture: null,
      imageAttributes: [],

      // mintedNFT: ["https://gateway.pinata.cloud/ipfs/QmTAy5v9hwDL1zKrwQy2TGXv3y4xDA2qk6zNQLspyoDsDt/bg_joolz.png", "https://gateway.pinata.cloud/ipfs/QmTAy5v9hwDL1zKrwQy2TGXv3y4xDA2qk6zNQLspyoDsDt/bg_Namocchi.jpeg", "https://gateway.pinata.cloud/ipfs/QmTAy5v9hwDL1zKrwQy2TGXv3y4xDA2qk6zNQLspyoDsDt/bg_Vyragami.jpeg", "https://gateway.pinata.cloud/ipfs/QmTAy5v9hwDL1zKrwQy2TGXv3y4xDA2qk6zNQLspyoDsDt/bg_saphrinna.jpeg", "https://gateway.pinata.cloud/ipfs/QmTAy5v9hwDL1zKrwQy2TGXv3y4xDA2qk6zNQLspyoDsDt/bg_saphrinna.jpeg"],
      // NFTName: ["peter", "Jane", "Boon Yeow", "Yong JIun", "Sebastian", "Joy"],
    };
    this.jsonthumbnailhash = "";
    this.contract_address = this.props.contract_address;
    this.wallet_address = this.props.wallet_address;
    this.contract_name = this.props.contract_name;
    const provider = new IconService.HttpProvider(
      "https://sejong.net.solidwallet.io/api/v3"
    );

    this.iconService = new IconService(provider);
    // this.contract_address = 'cx242815948091f53dd31b576e5c82e2bbbec2db9c';
    // this.wallet_address = 'hxdf253be1cf4c4c7ea87ac649ac1694cfd0b072d8';
    this.mintedLink = [];
    this.mintedindex = [];
    this.jsonHash = "";
    // this.gateway = [
    //     "astyanax.io",
    //     "ipfs.io",
    //     "ipfs.infura.io",
    //     "infura-ipfs.io",
    //     "ipfs.eth.aragon.network",
    //     "cloudflare-ipfs.com",
    //     "ipfs.fleek.co",
    //     "cf-ipfs.com",
    //     "gateway.pinata.cloud",
    //     "cf-ipfs.com",
    //     "astyanax.io",
    //     "infura-ipfs.io",
    //     "ipfs.kxv.io",
    // ];
    // this.gateway = ['astyanax.io', 'ipfs.io', 'ipfs.infura.io', 'infura-ipfs.io', 'ipfs.eth.aragon.network'];
  }

  async componentDidMount() {
    console.log(this.contract_address, this.wallet_address);
    await this.getMintedNFT(this.contract_address, this.wallet_address);

    console.log("this.mintedLink componentdidmount", this.mintedLink);
    for (let mintNFT of this.mintedLink) {
      this.mintedindex.push(mintNFT.split("/")[1].split(".")[0]);
      const pinataEndpoint3 = `https://gateway.pinata.cloud/ipfs/${mintNFT}`;
      let minted_nft_response = await axios
        .get(pinataEndpoint3)
        .then((response) => {
          console.log(response);
          this.state.mintedNFT.push(response.data.image);
          this.state.NFTName.push(response.data.image.split("/")[5]);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    await this.getJSONThumbnailMetahash();
    const pinataEndpoint4 = `https://gateway.pinata.cloud/ipfs/${this.jsonthumbnailhash}`;
    let json_upload_response2 = await axios
      .get(pinataEndpoint4)
      .then((response) => {
        console.log(response);
        this.setState({ thumbnailFiles: response.data.files_link });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getJSONThumbnailMetahash = async () => {
    const callObj = new IconBuilder.CallBuilder()
      .from(null)
      .to(this.contract_address)
      .method("getJSONThumbnailMetahash")
      .build();

    let result = await this.iconService
      .call(callObj)
      .execute()
      .then((response) => {
        console.log("getJSONThumbnailMetahash", response);
        this.jsonthumbnailhash = response;
      })
      .catch((error) => {
        console.log("getJSONThumbnailMetahash", error);
        Promise.resolve({ error });
      });
    return result;
  };

  getMetahash = async () => {
    const callObj = new IconBuilder.CallBuilder()
      .from(null)
      .to(this.contract_address)
      .method("getMetahash")
      .build();

    let result = await this.iconService
      .call(callObj)
      .execute()
      .then((response) => {
        console.log("getMetahash", response);
        return response;
      })
      .catch((error) => {
        console.log("getMetahash", error);
        Promise.resolve({ error });
      });
    return result;
  };

  async getMintedNFT(contractAddress, walletAddress) {
    const callObj = new IconBuilder.CallBuilder()
      .from(null)
      .to(contractAddress)
      .method("balanceOf")
      .params({
        _owner: walletAddress,
      })
      .build();

    let result = await this.iconService
      .call(callObj)
      .execute()
      .then((response) => {
        this.mintedLink = response;
        return response;
      })
      .catch((error) => {
        console.log("error", error);
        Promise.resolve({ error });
      });
    return result;
  }

  getMetadata = async (idx) => {
    console.log("getmetadata", this.mintedLink[idx]);
    let jsonMetadata = await axios
      .get("https://launchpad.mypinata.cloud/ipfs/" + this.mintedLink[idx])
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
    this.setState({ imageAttributes: jsonMetadata.data.attributes });
  };

  //modal handler
  handleSettingsModal = () => {
    this.setState({ showAdvancedSettings: true });
  };

  hideSettingsModal = () => {
    this.setState({ showAdvancedSettings: false });
  };

  render() {
    return (
      <div id="usergallery" style={{ minHeight: "100vh" }}>
        <h1 className="display-6">
          Your owned NFT from Collection:
          <br />
          {this.contract_name}
        </h1>
        <div
          className="row"
          style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
        >
          {this.mintedindex.map((data, index) => (
            <div class="col-lg-4 col-md-12 mb-4 mb-lg-0">
              <a
                target="_blank"
                onClick={() =>
                  this.setState({
                    showAdvancedSettings: true,
                    modaltitle: this.state.thumbnailFiles[data].name,
                    modalpicture: this.state.mintedNFT[index],
                    metadata: this.getMetadata(index),
                  })
                }
              >
                <img
                  // src={
                  //     "https://" +
                  //     this.gateway[index] +
                  //     this.state.thumbnailFiles[data].link.slice(28)
                  // }
                  src={this.state.mintedNFT[index]}
                  class="w-100 shadow-1-strong rounded"
                />
                <span class="my-2">{this.state.thumbnailFiles[data].name}</span>
              </a>
            </div>
          ))}
        </div>
        <Modal
          closeOnOverlayClick={false}
          isOpen={this.state.showAdvancedSettings}
          onClose={this.hideSettingsModal}
          size={"full"}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              borderBottom="2px"
              borderColor="gray.200"
              textAlign={"center"}
            >
              {this.state.modaltitle}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody marginLeft={"100px"} marginRight={"100px"}>
              <Flex>
                <Box boxSize="xl">
                  <Image
                    width={"100%"}
                    objectFit="cover"
                    // src={this.state.modalpicture} />
                    src={this.state.modalpicture}
                  />
                </Box>

                <Box marginLeft={"40px"} pt="20px">
                  <Box textStyle="h1" marginBottom={"3px"}>
                    Owner
                  </Box>
                  <Text
                    fontSize={"25px"}
                    color={"#2F4F4F"}
                    marginBottom={"8px"}
                  >
                    {this.wallet_address}
                  </Text>
                  <Box textStyle="h1" marginBottom={"3px"}>
                    Contract
                  </Box>
                  <Text
                    fontSize={"25px"}
                    color={"#2F4F4F"}
                    marginBottom={"8px"}
                  >
                    {this.contract_address}
                  </Text>
                  <Box textStyle="h1" marginBottom={"10px"}>
                    Attributes
                  </Box>
                  <SimpleGrid columns={2} spacingX={5} spacingY={3}>
                    {this.state.imageAttributes.map((data, i) => (
                      <Box bg="#202225" borderRadius="0.5rem" p="0.5rem">
                        <Text
                          color="white"
                          textAlign="center"
                          fontWeight="bold"
                        >
                          {data.trait_type}
                        </Text>
                        <Text color="white" textAlign="center">
                          {data.value}
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    );
  }
}
