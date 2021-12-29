import React, { Component } from 'react'
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
            // mintedNFT: ["https://gateway.pinata.cloud/ipfs/QmTAy5v9hwDL1zKrwQy2TGXv3y4xDA2qk6zNQLspyoDsDt/bg_joolz.png", "https://gateway.pinata.cloud/ipfs/QmTAy5v9hwDL1zKrwQy2TGXv3y4xDA2qk6zNQLspyoDsDt/bg_Namocchi.jpeg", "https://gateway.pinata.cloud/ipfs/QmTAy5v9hwDL1zKrwQy2TGXv3y4xDA2qk6zNQLspyoDsDt/bg_Vyragami.jpeg", "https://gateway.pinata.cloud/ipfs/QmTAy5v9hwDL1zKrwQy2TGXv3y4xDA2qk6zNQLspyoDsDt/bg_saphrinna.jpeg", "https://gateway.pinata.cloud/ipfs/QmTAy5v9hwDL1zKrwQy2TGXv3y4xDA2qk6zNQLspyoDsDt/bg_saphrinna.jpeg", "https://gateway.pinata.cloud/ipfs/QmTAy5v9hwDL1zKrwQy2TGXv3y4xDA2qk6zNQLspyoDsDt/bg_saphrinna.jpeg", "https://gateway.pinata.cloud/ipfs/QmTAy5v9hwDL1zKrwQy2TGXv3y4xDA2qk6zNQLspyoDsDt/bg_Namocchi.jpeg", "https://gateway.pinata.cloud/ipfs/QmTAy5v9hwDL1zKrwQy2TGXv3y4xDA2qk6zNQLspyoDsDt/bg_Vyragami.jpeg"],
            // NFTName: ["peter", "Jane", "Boon Yeow", "Yong JIun", "Sebastian", "Joy"],
            gateway: null,
        };
        this.contract_address = this.props.contract_address;
        this.wallet_address = this.props.wallet_address;
        const provider = new IconService.HttpProvider(
            "https://sejong.net.solidwallet.io/api/v3"
        );

        this.iconService = new IconService(provider);
        // this.contract_address = 'cx242815948091f53dd31b576e5c82e2bbbec2db9c';
        // this.wallet_address = 'hxdf253be1cf4c4c7ea87ac649ac1694cfd0b072d8';
        this.mintedLink = [];
        // this.gateway = ['astyanax.io', 'ipfs.io', 'ipfs.infura.io', 'infura-ipfs.io', 'ipfs.eth.aragon.network', 'cloudflare-ipfs.com', 'ipfs.fleek.co', 'cf-ipfs.com', 'gateway.pinata.cloud', 'ipfs.azurewebsites.net', 'cf-ipfs.com', 'astyanax.io', 'infura-ipfs.io', 'ipfs.kxv.io'];
        this.gateway = ['astyanax.io', 'ipfs.io', 'ipfs.infura.io', 'infura-ipfs.io', 'ipfs.eth.aragon.network'];

    }

    async componentDidMount() {
        await this.getMintedNFT(this.contract_address, this.wallet_address);
        for (let mintNFT of this.mintedLink) {
            const pinataEndpoint3 = `https://gateway.pinata.cloud/ipfs/${mintNFT}`;
            let minted_nft_response = await axios
                .get(pinataEndpoint3)
                .then((response) => {
                    this.state.mintedNFT.push(response.data.image)
                    this.state.NFTName.push(response.data.image.split("/")[-1])
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        let rounds = this.state.mintedNFT.length / this.gateway.length;
        if (rounds <= 1) {
            this.setState({ gateway: this.gateway });
        }
        else if (rounds > Math.floor(rounds)) {
            this.gateway = Array(Math.ceil(rounds)).fill(this.gateway).flat();
            this.setState({ gateway: this.gateway });
        }
        else {
            this.gateway = Array(rounds).fill(this.gateway).flat();
            this.setState({ gateway: this.gateway });
        }
        // console.log(this.state.gateway)
        console.log(this.state.mintedNFT)
        // console.log(this.mintedLink)
    }

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
        return (
            <div id="usergallery">
                <h1 className="display-6">Your owned NFT from Collection:<br />{this.contract_address}</h1>
                <div className="row">
                    {this.state.mintedNFT.map((data, index) => (
                        <div class="col-lg-4 col-md-12 mb-4 mb-lg-0">
                            <a target="_blank" href={data}>
                                <img src={"https://" + this.gateway[index] + data.slice(28)} class="w-100 shadow-1-strong rounded" />
                                <span class="my-2">{this.state.NFTName[index]}</span>
                            </a>
                        </div>
                    ))}


                </div>
            </div >
        )
    }
}
