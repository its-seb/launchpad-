import React, { Component } from "react";
import IconService from "icon-sdk-js";
import "./style.css";
const axios = require("axios");
const { IconConverter, IconBuilder, HttpProvider } = IconService;

export default class Usergallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mintedNFT: [],
      NFTName: [],
      thumbnailFiles: [],

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
    this.gateway = [
      "astyanax.io",
      "ipfs.io",
      "ipfs.infura.io",
      "infura-ipfs.io",
      "ipfs.eth.aragon.network",
      "cloudflare-ipfs.com",
      "ipfs.fleek.co",
      "cf-ipfs.com",
      "gateway.pinata.cloud",
      "cf-ipfs.com",
      "astyanax.io",
      "infura-ipfs.io",
      "ipfs.kxv.io",
    ];
    // this.gateway = ['astyanax.io', 'ipfs.io', 'ipfs.infura.io', 'infura-ipfs.io', 'ipfs.eth.aragon.network'];
  }

  async componentDidMount() {
    console.log(this.contract_address, this.wallet_address);
    await this.getMintedNFT(this.contract_address, this.wallet_address);

    console.log(this.mintedLink);
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

    let rounds = this.state.mintedNFT.length / this.gateway.length;
    if (rounds <= 1) {
      this.setState({ gateway: this.gateway });
    } else if (rounds > Math.floor(rounds)) {
      this.gateway = Array(Math.ceil(rounds)).fill(this.gateway).flat();
      this.setState({ gateway: this.gateway });
    } else {
      this.gateway = Array(rounds).fill(this.gateway).flat();
      this.setState({ gateway: this.gateway });
    }
    // console.log(this.state.gateway)
    console.log(this.state.mintedNFT);
    console.log(this.state.NFTName);

    console.log(this.mintedLink);
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

  render() {
    console.log(this.state.thumbnailFiles);
    console.log(this.mintedindex);
    return (
      <div id="usergallery">
        <h1 className="display-6">
          Your owned NFT from Collection:
          <br />
          {this.contract_name}
        </h1>
        <div className="row">
          {this.mintedindex.map((data, index) => (
            <div class="col-lg-4 col-md-12 mb-4 mb-lg-0">
              <a target="_blank" href={this.state.mintedNFT[index]}>
                <img
                  src={
                    "https://" +
                    this.gateway[index] +
                    this.state.thumbnailFiles[data].link.slice(28)
                  }
                  class="w-100 shadow-1-strong rounded"
                />
                <span class="my-2">{this.state.thumbnailFiles[data].name}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
