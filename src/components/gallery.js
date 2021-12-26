import IconService from "icon-sdk-js";
import "./app_content.css";
import React, { Component } from "react";
import ICONexConnection from "./utils/interact.js";
import { Navigate } from "react-router-dom";
import {
    Button,
    Container,
    Modal,
    Row,
    Col,
    Card,
    ProgressBar,
} from "react-bootstrap";
import { PhotographIcon } from "@heroicons/react/solid";
import "./global.css";
import "./style.css";
const axios = require("axios");
const { IconConverter, IconBuilder, HttpProvider } = IconService;

class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            metahash: this.props.metahash,
            uploadedFiles: [],
        }
        const provider = new IconService.HttpProvider(
            "https://sejong.net.solidwallet.io/api/v3"
        );
        this.jsonhash = '';
        this.iconService = new IconService(provider);
        this.contractAddress = localStorage.getItem("SELECTED_CONTRACT_ADDRESS");
    }
    getJSONFileMetahash = async () => {
        const callObj = new IconBuilder.CallBuilder()
            .from(null)
            .to(this.contractAddress)
            .method("getJSONFileMetahash")
            .build();

        let result = await this.iconService
            .call(callObj)
            .execute()
            .then((response) => {
                console.log("getJSONFileMetahash", response);
                this.jsonhash = response;
            })
            .catch((error) => {
                console.log("getJSONFileMetahash", error);
                Promise.resolve({ error });
            });
        return result
    };


    async componentDidMount() {
        await this.getJSONFileMetahash();
        const pinataEndpoint3 = `https://gateway.pinata.cloud/ipfs/${this.jsonhash}`;
        let json_upload_response = await axios.get(pinataEndpoint3)
            .then((response) => {
                this.setState({ uploadedFiles: response.data.files_link });
            }).catch((error) => {
                console.log(error)
            });
    }

    render() {
        return (
            // <div>
            //     {(this.state.uploadedFiles).map((data) => <li>{data}</li>)}
            // </div>
            <div class="row">
                {(this.state.uploadedFiles).map((data) =>

                    <div className="col-lg-4 col-md-12 mb-4 mb-lg-0" href="img_forest.jpg">
                        <img src={data} class="w-100 shadow-1-strong rounded mb-4" />
                    </div>


                )}
            </div>

        );
    }
}

export default Gallery;
